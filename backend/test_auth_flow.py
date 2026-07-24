import time
import requests

BASE_URL = "http://127.0.0.1:8000"

def test_full_auth_flow():
    session = requests.Session()
    
    unique_id = int(time.time())
    test_email = f"testpatient_{unique_id}@luminahealth.com"
    test_password = "SecurePassword123!"
    test_name = "Jane Doe"
    test_phone = "+15551234567"

    print("--- 1. Testing Signup (POST /auth/signup) ---")
    signup_payload = {
        "fullName": test_name,
        "email": test_email,
        "phone": test_phone,
        "password": test_password,
        "confirmPassword": test_password,
        "role": "patient"
    }
    
    res = session.post(f"{BASE_URL}/auth/signup", json=signup_payload)
    print(f"Signup Status: {res.status_code}")
    print(f"Signup Body: {res.json()}")
    print(f"Cookies received: {session.cookies.get_dict()}")
    
    assert res.status_code == 201, f"Unexpected signup status: {res.status_code}"
    assert "access_token" in session.cookies, "access_token cookie missing!"
    assert "hashed_password" not in res.json(), "Security leak: hashed_password in body!"
    print("PASSED: Signup successfully created user and set httpOnly cookie!")

    print("\n--- 2. Testing Duplicate Email Signup (POST /auth/signup) ---")
    dup_res = session.post(f"{BASE_URL}/auth/signup", json=signup_payload)
    print(f"Duplicate Signup Status: {dup_res.status_code}")
    print(f"Duplicate Signup Body: {dup_res.json()}")
    assert dup_res.status_code == 409, "Expected 409 Conflict for duplicate email"
    print("PASSED: 409 Conflict correctly returned for duplicate email!")

    print("\n--- 3. Testing GET /auth/me (Protected Route) ---")
    me_res = session.get(f"{BASE_URL}/auth/me")
    print(f"Auth Me Status: {me_res.status_code}")
    print(f"Auth Me Body: {me_res.json()}")
    assert me_res.status_code == 200, "Protected route failed with valid cookie"
    assert me_res.json()["email"] == test_email
    print("PASSED: /auth/me successfully decoded JWT cookie and fetched user!")

    print("\n--- 4. Testing Invalid Login (POST /auth/login) ---")
    wrong_login = session.post(f"{BASE_URL}/auth/login", json={"email": test_email, "password": "WrongPassword123"})
    print(f"Invalid Login Status: {wrong_login.status_code}")
    print(f"Invalid Login Body: {wrong_login.json()}")
    assert wrong_login.status_code == 401
    print("PASSED: Generic 401 returned for bad credentials!")

    print("\n--- 4b. Testing Mismatched Role Login (Patient trying Doctor portal) ---")
    mismatched_login = session.post(f"{BASE_URL}/auth/login", json={"email": test_email, "password": test_password, "role": "doctor"})
    print(f"Mismatched Role Status: {mismatched_login.status_code}")
    print(f"Mismatched Role Body: {mismatched_login.json()}")
    assert mismatched_login.status_code == 401
    assert "registered as a Patient" in mismatched_login.json()["detail"]
    print("PASSED: Role mismatch correctly blocked!")

    print("\n--- 5. Testing Valid Login with Matching Role (POST /auth/login) ---")
    valid_login = session.post(f"{BASE_URL}/auth/login", json={"email": test_email, "password": test_password, "role": "patient"})
    print(f"Valid Login Status: {valid_login.status_code}")
    print(f"Valid Login Body: {valid_login.json()}")
    assert valid_login.status_code == 200
    assert "access_token" in session.cookies
    print("PASSED: Login succeeded with matching role!")

    print("\n--- 6. Testing Logout (POST /auth/logout) ---")
    logout_res = session.post(f"{BASE_URL}/auth/logout")
    print(f"Logout Status: {logout_res.status_code}")
    print(f"Logout Body: {logout_res.json()}")
    assert logout_res.status_code == 200

    print("\n--- 7. Testing GET /auth/me After Logout ---")
    unauth_session = requests.Session()
    unauth_me = unauth_session.get(f"{BASE_URL}/auth/me")
    print(f"Unauthenticated Me Status: {unauth_me.status_code}")
    assert unauth_me.status_code == 401
    print("PASSED: Protected route correctly denied access after logout!")

    print("\n==========================================")
    print("ALL API AUTHENTICATION TESTS PASSED 100%!")
    print("==========================================")

if __name__ == "__main__":
    test_full_auth_flow()
