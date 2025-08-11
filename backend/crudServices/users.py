from typing import Dict, Optional
from ..client import db, SERVER_TS # type: ignore

COL = "users"

def create_user(user_id: str, email: str, display_name: str, is_guest: bool = False) -> None:
    """Create a new user document using their Firebase Auth UID as the doc ID."""
    db.collection(COL).document(user_id).set({  # type: ignore
        "email": email,
        "display_name": display_name,
        "is_guest": is_guest,
        "created_at": SERVER_TS,  # type: ignore
    })

def get_user(user_id: str) -> Optional[Dict]: # type: ignore
    """Retrieve a user document by UID."""
    doc = db.collection(COL).document(user_id).get() # type: ignore
    return doc.to_dict() if doc.exists else None

def get_all_users() -> list[Dict]: # type: ignore
    """Retrieve all user documents in the 'users' collection."""
    docs = db.collection(COL).stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs] # type: ignore

def update_user(user_id: str, updates: Dict) -> None: # type: ignore
    """Update fields on a user document."""
    db.collection(COL).document(user_id).update(updates) # type: ignore

def delete_user(user_id: str) -> None:
    """Delete a user document by UID."""
    db.collection(COL).document(user_id).delete()
