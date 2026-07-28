from typing import Optional
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Read JWT token from httpOnly cookie 'access_token' or Authorization header
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id: Optional[str] = payload.get("sub")
    user = None
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()

    # Fallback search by email if database was reseeded
    if user is None:
        user_email = payload.get("email")
        if user_email:
            user = db.query(User).filter(User.email == user_email.lower()).first()

    if user is None:
        raise credentials_exception

    return user
