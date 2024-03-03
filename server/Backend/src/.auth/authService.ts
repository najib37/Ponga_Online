import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { authenticator } from "otplib";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  async loginGoogle(user: User) {
    console.log(user);
    const payload = { username: user.username, sub: user.id }
    const token = await this.generateJwtToken(payload)
    return token
  }

  async login42(user: User) {
    console.log(user)
    const payload = { username: user.username, sub: user.id }
    const token = await this.generateJwtToken(payload);
    return token;
  }

  isTwoFactorAuthenticationCodeValid(twoFactorAuthCode: string, user: User) {

    console.log("hello ", twoFactorAuthCode);
    console.log("hello ", user.twoFactor);

    return authenticator.verify({ token: twoFactorAuthCode, secret: user.twoFactor })
  }

  async generateJwtToken(payload: any) {
    return this.jwtService.sign(payload)
  }


  async loginOtp(token: string, user: User) {
    // first get the jwt token that was assigned in the login 
    const isCodeValid = await this.isTwoFactorAuthenticationCodeValid(
      token, user
    )
    if (!isCodeValid) {
      throw new HttpException('Invalid code', HttpStatus.FORBIDDEN);
    }
    return { valid: true }
    // verify it and then verify the token of 2fa 
  }

}
