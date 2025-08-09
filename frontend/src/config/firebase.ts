// src/config/firebase.ts
import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

// Firebase is automatically initialized with google-services.json
// This file ensures all modules are imported correctly

// Check if Firebase is initialized
if (!firebase.apps.length) {
  console.error('Firebase not initialized! Check google-services.json');
}

export default firebase;
