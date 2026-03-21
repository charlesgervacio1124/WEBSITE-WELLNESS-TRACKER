# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Name it "wellness-tracker" and follow the setup wizard
4. Enable Google Analytics (optional)

## Step 2: Get Your Firebase Config

1. In the Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click on the web app icon `</>`
4. Copy your Firebase config object

## Step 3: Update `firebase/config.js`

Replace the placeholder values in `firebase/config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable "Email/Password" sign-in method
4. Save

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Choose your region and create

## Step 6: Set Firestore Rules (Optional but recommended)

In Firestore, go to **Rules** and update to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /wellness/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

## Step 7: Test It Out!

1. Run `npm start`
2. Go to `http://localhost:5175/signup`
3. Create an account
4. Start tracking your wellness!

## Firebase Data Structure

Your Firestore database will be organized like this:

```
users/
  {userId}/
    - email: string
    - sleepGoal: number (minutes)
    - waterGoal: number (liters)
    - stepsGoal: number
    - createdAt: timestamp
    wellness/
      {date}/
        - date: string (MM/DD/YYYY)
        - sleep: number (minutes)
        - water: number (liters)
        - steps: number
```

## Troubleshooting

- **"Cannot find firebase config"** - Make sure you've updated `firebase/config.js` with your real credentials
- **"Permission denied"** - Check your Firestore Rules, or make sure you're logged in
- **"User not found"** - Make sure you've enabled Email/Password authentication in Firebase

Enjoy tracking your wellness! 🎉
