import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

export interface JWTPayload {
  userId: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  generateToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  // Dummy user for development
  getDummyUser(): JWTPayload {
    return {
      userId: 1,
      email: 'test@example.com'
    };
  }
} 