import { Controller, Post, Body } from '@nestjs/common';
import { AuthService, JWTPayload } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    // For now, return dummy user token
    const dummyUser = this.authService.getDummyUser();
    const token = this.authService.generateToken(dummyUser);
    
    return {
      access_token: token,
      user: dummyUser,
    };
  }

  @Post('verify')
  async verifyToken(@Body() body: { token: string }) {
    const payload = this.authService.verifyToken(body.token);
    return { valid: !!payload, user: payload };
  }
} 