from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserLogin, UserOut, UserSignup

router = APIRouter()

COOKIE_NAME = "access_token"

def set_auth_cookie(response: Response, token: str):
    is_production = settings.ENVIRONMENT.lower() == "production"
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=is_production,  # False on HTTP dev, True on production HTTPS
        path="/"
    )

def clear_auth_cookie(response: Response):
    is_production = settings.ENVIRONMENT.lower() == "production"
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        samesite="lax",
        secure=is_production,
        path="/"
    )

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(
    user_in: UserSignup,
    response: Response,
    db: Session = Depends(get_db)
):
    # Check if confirm password matches if provided
    if user_in.confirm_password and user_in.password != user_in.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    # Check if email is already registered
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered"
        )

    # Hash password and create user
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        full_name=user_in.full_name,
        email=user_in.email.lower(),
        phone=user_in.phone,
        role=user_in.role or "patient",
        hashed_password=hashed_pwd
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create JWT token and set in httpOnly cookie
    token = create_access_token(subject=user.id)
    set_auth_cookie(response, token)

    return user

@router.post("/login", response_model=UserOut)
def login(
    user_in: UserLogin,
    response: Response,
    db: Session = Depends(get_db)
):
    # Verify user exists and password is correct
    user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check if role matches if role was provided in login request
    if user_in.role and user.role != user_in.role:
        role_title = user_in.role.capitalize()
        actual_role_title = user.role.capitalize()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"This account is registered as a {actual_role_title}, not a {role_title}. Please switch portal tab to sign in."
        )

    # Create JWT token and set in httpOnly cookie
    token = create_access_token(subject=user.id)
    set_auth_cookie(response, token)

    return user

@router.post("/logout")
def logout(response: Response):
    clear_auth_cookie(response)
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
