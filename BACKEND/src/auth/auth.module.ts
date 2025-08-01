import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [FirebaseModule, PrismaModule],
  providers: [],
  controllers: [],
  exports: [],
})
export class AuthModule {} 