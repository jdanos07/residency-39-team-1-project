# Import any and all CRUD connections to be tested
# DB connection must be active to test

from backend.crudServices.users import create_user, get_user, get_all_users # type: ignore 

if __name__ == "__main__":
    uid = "test-user-001"
    create_user(uid, "test@example.com", "Test User", False)
    print("Retrieved User:", get_user(uid)) # type: ignore 
    print("All Users:", get_all_users()) # type: ignore 

