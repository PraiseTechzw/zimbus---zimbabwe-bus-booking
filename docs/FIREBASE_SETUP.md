# Firebase Setup Guide for ZimBus

This document provides step-by-step instructions to set up the Firebase backend for the ZimBus platform.

## 🚀 Steps to Setup

### 1. Create a Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add Project"** and name it `zimbus---zimbabwe-bus-booking` or similar.
3.  (Optional) Enable Google Analytics.

### 2. Enable Authentication
1.  In the left sidebar, click **"Authentication"**.
2.  Click **"Get Started"**.
3.  Go to the **"Sign-in method"** tab.
4.  Enable **"Google"** and follow the instructions to configure it.
5.  Add `localhost` and your production domain to the **"Authorized domains"** list.

### 3. Setup Firestore Database
1.  In the left sidebar, click **"Firestore Database"**.
2.  Click **"Create Database"**.
3.  Choose **"Start in production mode"**.
4.  Select a location (e.g., `nam5 (us-central)`).
5.  After creation, go to the **"Rules"** tab and update them using the content of `firestore.rules` in this repository.

### 4. Register the Web App
1.  In the Project Overview page, click the **Web icon (`</>`)** to register a new web app.
2.  Name it `ZimBus Web Client`.
3.  Copy the `firebaseConfig` object and create a `firebase-applet-config.json` file in the root directory.

```json
{
  "projectId": "YOUR_PROJECT_ID",
  "appId": "YOUR_APP_ID",
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "firestoreDatabaseId": "(default)",
  "storageBucket": "YOUR_STORAGE_BUCKET",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "measurementId": "YOUR_MEASUREMENT_ID"
}
```

### 5. Deployment
We recommend using [Firebase Hosting](https://firebase.google.com/docs/hosting) for simple and fast deployment.

1.  Initialize Firebase: `npx firebase init hosting`
2.  Build the app: `npm run build`
3.  Deploy: `npx firebase deploy`

---

## 🛡️ Security Rules Reminder

**Never deploy without valid security rules.** Our rules are designed to prevent unauthorized access to user bookings and ensure that only admins can modify bus schedules.
