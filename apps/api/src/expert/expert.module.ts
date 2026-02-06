import { Module } from '@nestjs/common';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [ExpertController],
  providers: [ExpertService],
  exports: [ExpertService],
})
export class ExpertModule {}
