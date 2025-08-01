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
      } catch (error) {
        throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
      }
    } else {
      this.app = admin.app();
    }
  }

  async verifyIdToken(idToken: string): Promise<FirebaseUser> {
    try {
      const decodedToken = await this.app.auth().verifyIdToken(idToken);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email!,
        emailVerified: decodedToken.email_verified || false,
      };
    } catch (error) {
      throw new Error('Invalid Firebase ID token');
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
      return null;
    }
  }
} 