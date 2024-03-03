import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './authService';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/googleStrategy';
import { JwtGuard } from './guard/jwt.guards';
import { NotificationModule } from 'src/notification/notification.module';

@Global()
@Module({
  imports: [JwtModule.register({
    secret : "this is the secret temp", // debug
    signOptions : {expiresIn : '7d'},
  }), UserModule, NotificationModule],
  controllers: [AuthController], 
  providers: [FortyTwoStrategy, AuthService, JwtStrategy, GoogleStrategy],
  exports: [JwtStrategy, AuthService, JwtModule]
})
export class AuthModule {}
