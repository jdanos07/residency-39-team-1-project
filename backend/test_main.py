# Import any and all CRUD connections to be tested
# DB connection must be active to test

from backend.crudServices.users import create_user, get_user # type: ignore 

if __name__ == "__main__":
    test_uid = "test-user-001"
    create_user(test_uid, "test@example.com", "Test User", False)
    user_data = get_user(test_uid) # type: ignore 
    print("Retrieved User:", user_data) # type: ignore 


