import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenerateModule } from './generate/generate.module';
import { ProjectsModule } from './projects/projects.module';
import { SlidesModule } from './slides/slides.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FirebaseModule,
    AuthModule,
    GenerateModule,
    ProjectsModule,
    SlidesModule,
    ChatModule,
  ],
})
export class AppModule {} 