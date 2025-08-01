import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

export interface FirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    // Initialize Firebase Admin SDK with service account file
    if (!admin.apps.length) {
      const serviceAccountPath = path.join(__dirname, '../../ai-pitch-deck-a5bc6-firebase-adminsdk-fbsvc-aa1f978ae2.json');
      
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
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