# One-time app init
# Replace GOOGLE_APPLICATION_CREDENTIALS with your Account Key location

import os
import firebase_admin # type: ignore
from firebase_admin import credentials, firestore # type: ignore

cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
if not cred_path:
    raise RuntimeError("GOOGLE_APPLICATION_CREDENTIALS env var not set.")

if not firebase_admin._apps: # type: ignore
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred) # type: ignore

db = firestore.client()
SERVER_TS = firestore.SERVER_TIMESTAMP  # type: ignore