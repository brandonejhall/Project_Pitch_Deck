# Firebase Authentication Setup

## Backend Setup

### 1. Install Firebase Admin SDK
```bash
cd BACKEND
npm install firebase-admin
```

### 2. Configure Firebase Admin SDK
You have two options for configuring Firebase Admin SDK:

#### Option A: Service Account Key (Recommended for Production)
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Place it in `BACKEND/src/firebase/serviceAccountKey.json`
5. Update `firebase.service.ts` to use the service account:

```typescript
this.app = admin.initializeApp({
  credential: admin.credential.cert(require('../firebase/serviceAccountKey.json')),
});
```

#### Option B: Application Default Credentials (Development)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Set project: `firebase use your-project-id`
4. The service will automatically use application default credentials

### 3. Environment Variables
Add to your `.env` file:
```bash
# Firebase Admin SDK (if using service account)
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
```

## Frontend Setup

### 1. Install Firebase SDK
```bash
cd FRONTEND
npm install firebase
```

### 2. Create Environment File
Create `.env` file in the FRONTEND directory:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# Backend API URL
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Get Firebase Configuration
1. Go to Firebase Console → Project Settings → General
2. Scroll down to "Your apps"
3. Click the web app icon (</>)
4. Register your app if needed
5. Copy the configuration values to your `.env` file

## Firebase Console Setup

### 1. Enable Authentication
1. Go to Firebase Console → Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider

### 2. Configure Security Rules (Optional)
If you plan to use Firestore or Storage, configure security rules to allow authenticated access.

## Testing the Setup

### 1. Start the Backend
```bash
cd BACKEND
npm run start:dev
```

### 2. Start the Frontend
```bash
cd FRONTEND
npm run dev
```

### 3. Test Authentication
1. Visit `http://localhost:8081`
2. You should see the login form
3. Create an account or sign in
4. Verify that API requests include the Firebase token

## Security Notes

- ✅ **No password storage**: Firebase handles all password security
- ✅ **Token-based auth**: Uses Firebase ID tokens for API requests
- ✅ **Automatic user creation**: Users are created in your database on first login
- ✅ **Secure token verification**: Backend verifies tokens with Firebase Admin SDK

## Troubleshooting

### Common Issues:

1. **"Invalid Firebase token" error**
   - Check that Firebase configuration is correct
   - Verify that Authentication is enabled in Firebase Console
   - Ensure environment variables are set correctly

2. **"No valid authorization header" error**
   - Check that the frontend is sending the Firebase token
   - Verify that the token is being included in API requests

3. **"Firebase app already initialized" error**
   - This is normal if the app is already initialized
   - The service handles this automatically

### Debug Steps:
1. Check browser console for Firebase errors
2. Verify environment variables are loaded
3. Test Firebase authentication in isolation
4. Check backend logs for token verification errors 