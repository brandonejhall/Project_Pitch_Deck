import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    console.log('🔐 FirebaseAuthGuard: Processing request');
    console.log('📋 Request URL:', request.url);
    console.log('📋 Request method:', request.method);
    console.log('📋 Authorization header present:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No valid authorization header found');
      console.error('📋 Auth header value:', authHeader);
      throw new UnauthorizedException('No valid authorization header');
    }

    const idToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('📝 Token length:', idToken.length);

    try {
      // Verify the Firebase ID token
      console.log('🔍 Verifying Firebase ID token in guard...');
      const firebaseUser = await this.firebaseService.verifyIdToken(idToken);
      console.log('✅ Firebase token verified successfully');

      // Find or create user in our database
      console.log('🔍 Looking up user in database...');
      let user = await this.prismaService.user.findUnique({
        where: { email: firebaseUser.email },
      });

      if (!user) {
        console.log('👤 Creating new user in database...');
        // Create new user if they don't exist
        user = await this.prismaService.user.create({
          data: {
            email: firebaseUser.email,
          },
        });
        console.log('✅ New user created with ID:', user.id);
      } else {
        console.log('✅ Existing user found with ID:', user.id);
      }

      // Attach user to request for use in controllers
      request.user = {
        id: user.id,
        email: user.email,
        firebaseUid: firebaseUser.uid,
      };

      console.log('✅ FirebaseAuthGuard: Authentication successful');
      return true;
    } catch (error) {
      console.error('❌ FirebaseAuthGuard: Authentication failed');
      console.error('🔍 Error type:', error.constructor.name);
      console.error('🔍 Error message:', error.message);
      console.error('🔍 Error stack:', error.stack);
      
      // Provide more specific error messages based on the error
      if (error.message.includes('expired')) {
        throw new UnauthorizedException('Firebase token has expired. Please reauthenticate.');
      } else if (error.message.includes('revoked')) {
        throw new UnauthorizedException('Firebase token has been revoked. Please reauthenticate.');
      } else if (error.message.includes('Invalid Firebase ID token')) {
        throw new UnauthorizedException('Invalid Firebase token format. Please reauthenticate.');
      } else {
        throw new UnauthorizedException(`Authentication failed: ${error.message}`);
      }
    }
  }
} 