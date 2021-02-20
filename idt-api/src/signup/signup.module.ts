import { Module } from '@nestjs/common';
import { SignUpController } from './signup.controller';
import { SignUpService } from './signup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './model/invite.entity';
import { MailerModule } from './../mailer/mailer.module';
import { UserModule } from './../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invite]),
    UserModule,
    MailerModule,
  ],
  controllers: [SignUpController],
  providers: [SignUpService],
})
export class SignUpModule {}
