import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

export interface FirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    // Initialize Firebase Admin SDK with base64 encoded service account
    if (!admin.apps.length) {
      const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
      
      if (!serviceAccountBase64) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is required');
      }

      try {
        // Decode base64 to string
        const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
        
        // Parse the JSON service account
        const serviceAccount = JSON.parse(serviceAccountJson);
        
        this.app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        
        // console.log('✅ Firebase Admin SDK initialized successfully');
        // console.log('📋 Project ID:', serviceAccount.project_id);
      } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin SDK:', error);
        throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
      }
    } else {
      this.app = admin.app();
      // console.log('✅ Using existing Firebase Admin SDK instance');
    }
  }

  async verifyIdToken(idToken: string): Promise<FirebaseUser> {
    try {
      // console.log('🔍 Verifying Firebase ID token...');
      // console.log('📝 Token length:', idToken.length);
      // console.log('📝 Token preview:', idToken.substring(0, 20) + '...');
      
      const decodedToken = await this.app.auth().verifyIdToken(idToken);
      
      // console.log('✅ Firebase token verification successful');
      // console.log('👤 User UID:', decodedToken.uid);
      // console.log('📧 User email:', decodedToken.email);
      // console.log('✅ Email verified:', decodedToken.email_verified);
      
      return {
        uid: decodedToken.uid,
        email: decodedToken.email!,
        emailVerified: decodedToken.email_verified || false,
      };
    } catch (error) {
      console.error('❌ Firebase token verification failed');
      console.error('🔍 Error code:', error.code);
      console.error('🔍 Error message:', error.message);
      console.error('🔍 Full error object:', JSON.stringify(error, null, 2));
      
      // Provide specific error messages based on Firebase error codes
      if (error.code === 'auth/id-token-expired') {
        throw new Error('Firebase ID token has expired');
      } else if (error.code === 'auth/id-token-revoked') {
        throw new Error('Firebase ID token has been revoked');
      } else if (error.code === 'auth/invalid-id-token') {
        throw new Error('Invalid Firebase ID token format');
      } else if (error.code === 'auth/argument-error') {
        throw new Error('Invalid Firebase ID token argument');
      } else {
        throw new Error(`Firebase token verification failed: ${error.message}`);
      }
    }
  }

  async getUserByUid(uid: string): Promise<FirebaseUser | null> {
    try {
      const userRecord = await this.app.auth().getUser(uid);
      return {
        uid: userRecord.uid,
        email: userRecord.email!,
        emailVerified: userRecord.emailVerified,
      };
    } catch (error) {
      console.error('❌ Failed to get user by UID:', error);
      return null;
    }
  }
} 