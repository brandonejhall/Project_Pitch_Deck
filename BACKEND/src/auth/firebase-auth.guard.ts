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

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No valid authorization header');
    }

    const idToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify the Firebase ID token
      const firebaseUser = await this.firebaseService.verifyIdToken(idToken);

      // Find or create user in our database
      let user = await this.prismaService.user.findUnique({
        where: { email: firebaseUser.email },
      });

      if (!user) {
        // Create new user if they don't exist
        user = await this.prismaService.user.create({
          data: {
            email: firebaseUser.email,
          },
        });
      }

      // Attach user to request for use in controllers
      request.user = {
        id: user.id,
        email: user.email,
        firebaseUid: firebaseUser.uid,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
} 