# LOOPY Frontend Development Setup Guide

## Overview
This guide will help team members set up their local development environment to match the current state of the frontend application, including Expo development build, Firebase integration, and authentication.

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **Git**
   - Download from: https://git-scm.com/
   - Verify: `git --version`

3. **Android Studio** (for Android development)
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API Level 33 or higher)
   - Set up Android Emulator or connect physical device

4. **Java Development Kit (JDK 17)**
   - Comes with Android Studio or download separately
   - Verify: `java --version`

## Step 1: Clone and Setup Repository

```bash
# Clone the repository
git clone https://github.com/residency-39-team-1/residency-39-team-1-project.git
cd residency-39-team-1-project

# Switch to develop branch
git checkout develop

# Pull latest changes
git pull origin develop
```

## Step 2: Get Firebase Configuration

### IMPORTANT: Obtain google-services.json
This file contains API keys and is NOT in the repository for security reasons.

**Options to get the file:**
1. Ask the team lead/project owner for the file
2. OR download it yourself from Firebase Console (if you have access):
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select project: `loopy-productivity-app`
   - Project Settings → Your Android App
   - Download `google-services.json`

**Place the file in:**
```
frontend/android/app/google-services.json
```

## Step 3: Install Dependencies

```bash
cd frontend

# Install npm packages
npm install

# Clean install if you have issues
rm -rf node_modules
npm install
```

## Step 4: Setup Expo Development Build

### First Time Setup
```bash
# Install Expo CLI globally (if not already installed)
npm install -g expo-cli eas-cli

# Login to Expo (optional but recommended)
expo login
```

### Build and Run Development Build

```bash
# For Android development
npx expo run:android

# If you get build errors, try cleaning first:
cd android
./gradlew clean
cd ..
npx expo run:android --clear
```

**Note:** The first build will take 5-10 minutes as it downloads dependencies and builds the native app.

## Step 5: Configure Development Environment

### Android Emulator Setup
1. Open Android Studio
2. Open AVD Manager (Virtual Device Manager)
3. Create a new virtual device (Pixel 4, API 33+ recommended)
4. Start the emulator before running `npx expo run:android`

### Physical Device Setup
1. Enable Developer Mode on your Android device
2. Enable USB Debugging
3. Connect via USB cable
4. Run `adb devices` to verify connection
5. Run `npx expo run:android` with device connected

## Step 6: Verify Firebase Setup

### Check Firebase Services
1. **Authentication** should have enabled:
   - Google Sign-In provider
   - Anonymous provider

2. **Firestore Database** should exist with:
   - Test collection/document (optional)
   - Security rules allowing authenticated access

### Test Authentication
1. Start the app: `npx expo run:android`
2. You should see the login screen
3. Test "Continue as Guest" - should work immediately
4. Test "Sign in with Google" - requires SHA-1 setup (see troubleshooting)

## Step 7: EAS Build Configuration (For Production Builds)

### Current Status
- EAS is configured in `frontend/eas.json`
- Development builds use local compilation
- Production builds will use EAS Build service

### Team Members Don't Need To:
- Set up EAS credentials (already configured)
- Create Expo account (unless building to EAS)
- Configure build profiles (already in eas.json)

### When EAS IS Needed:
- Creating production APK/AAB files
- Submitting to app stores
- Creating preview builds for testing

## Common Commands

```bash
# Start development server
npx expo start

# Run on Android (development build)
npx expo run:android

# Clear cache and rebuild
npx expo run:android --clear

# Check for issues
npx expo doctor

# View logs
npx react-native log-android
```

## Troubleshooting

### "Google Sign-In Error (Developer Error)"
**Solution:** Your SHA-1 fingerprint needs to be added to Firebase
```bash
cd android
./gradlew signingReport
# Copy the SHA1 from the debug variant
# Add to Firebase Console → Project Settings → Your App → SHA certificate fingerprints
# Re-download google-services.json and replace the file
```

### "Module not found" errors
```bash
cd frontend
rm -rf node_modules
npm install
cd android
./gradlew clean
cd ..
npx expo run:android --clear
```

### "ENOENT: no such file or directory" for google-services.json
- Make sure you've obtained and placed the `google-services.json` file in `frontend/android/app/`

### Build fails with Java errors
- Ensure JDK 17 is installed and JAVA_HOME is set correctly
- Check Android Studio → Settings → Build Tools → Gradle → Gradle JDK

### Metro bundler issues
```bash
# Reset Metro cache
npx react-native start --reset-cache

# Or kill Metro and restart
killall node  # On Mac/Linux
# Then run your build command again
```

## Project Structure

```
frontend/
├── android/                 # Android native code
│   └── app/
│       └── google-services.json  # (YOU NEED TO ADD THIS)
├── src/
│   ├── contexts/           # React contexts (AuthContext)
│   ├── screens/            # Screen components
│   └── config/             # Configuration files
├── App.tsx                 # Main app entry point
├── package.json           # Dependencies
└── eas.json              # EAS Build configuration
```

## Current Implementation Status

### ✅ Completed
- Expo development build setup
- Firebase integration
- Google Sign-In authentication
- Anonymous authentication
- Basic screen structure (Login, Home)
- Authentication context

### 🚧 In Progress (Sprint 1)
- Navigation setup
- Task CRUD operations
- Real-time updates
- Lottie animations

## Need Help?

1. Check if your issue is in the Troubleshooting section
2. Ask in the team Slack channel
3. Check Expo docs: https://docs.expo.dev/
4. Check React Native Firebase docs: https://rnfirebase.io/

## Important Notes

- Never commit `google-services.json` to the repository
- Always pull latest changes before starting work
- Create feature branches from `develop`, not `main`
- Run the app regularly to catch issues early
- Keep your Android Studio and SDK tools updated

---

Last updated: August 2025
Sprint 1: Core Infrastructure
