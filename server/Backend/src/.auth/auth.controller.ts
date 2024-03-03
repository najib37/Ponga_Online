import { Controller, Get, Post, Logger, Next, Req, Res, UseGuards, Body, UnauthorizedException, HttpCode, Delete, UseFilters } from '@nestjs/common';
import { FortyTwoGuard } from './guard/42.guard';
import { AuthService } from './authService';
import { JwtGuard } from './guard/jwt.guards';
import { toDataURL } from 'qrcode';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { nextTick } from 'process';
import { GoogleGuard } from './guard/googleGuard'
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { strict } from 'assert';
import { AuthReq } from 'src/user/types/AuthReq';
import { SelectUser } from 'src/user/entities/user-allowed-fields.entity';
import { Response } from "express"
import { AuthfilterFilter } from './authfilter/authfilter.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService, private readonly userservice: UserService) { }

  // login

  @UseGuards(GoogleGuard)
  @Get('google')
  googleLogin() { }

  @UseGuards(GoogleGuard)
  @Get('google/redirect')
  async googleRedirect(@Req() req, @Res({ passthrough: true }) res) {
    const accessToken = await this.authservice.loginGoogle(req.user);
    // ! if (the user is 2fa off redirect to a specific page or otherwise)

    res.cookie('jwt', accessToken, { httpOnly: true })
      .redirect(process.env.CLIENT_URL + '/home')
    // if (req.user.twoFactorEnabled == false)
    // {
    //     res.redirect("http://localhost:5600/home")
    // }
    // else {
    //   res.redirect("")
    // }
    // return req.user;
  }


  @UseGuards(FortyTwoGuard)
  @Get('42')
  loginIn(@Req() req) {
  }


  @UseGuards(FortyTwoGuard)
  @Get('42/callback')
  async redirectUser(
    @Res({ passthrough: true }) res,
    @Req() req: Request & { user: User },
  ) {
    const accessToken = await this.authservice.login42(req.user);
    const user = await this.userservice.findOne(req.user.id, {
      twoFactorEnabled: true
    });

    if (user?.twoFactorEnabled === true)
      res.cookie('jwt', accessToken, { httpOnly: true }).redirect(process.env.CLIENT_URL + '/otp');
    else
      res.cookie('jwt', accessToken, { httpOnly: true })
        .redirect(process.env.CLIENT_URL + '/home')

    // ! if (the user is 2fa off redirect to a specific page or otherwise)
    // return { user : req.user } 
    //if (req.user.twoFactorEnabled == false)
    // {
    //     res.redirect("http://localhost:5600/home")
    // }
    // else {
    //   res.redirect("")
    // }

    // res.cookie('jwt', accessToken, { httpOnly: true });

    // //  Redirect to the frontend
    // res.redirect(env.FRONT_URL);

  }

  @UseGuards(JwtGuard)
  @UseFilters(AuthfilterFilter)
  @Get('status')
  async LogingStatus(@Req() req: AuthReq) {

    const user = await this.userservice.findOne(req.user?.sub, { twoFactorEnabled: true });
    // console.log("user =", user);

    if (!user)
      return {}

    return ({
      message: 'authorized',
      authorized: true,
      twoFactor: user.twoFactorEnabled,
    })
  }


  @UseGuards(JwtGuard)
  @Get('/2fa/status')
  async userAuthStatus(@Res({ passthrough: true }) res, @Req() req) {

    const user = await this.userservice.findOne(req.user?.sub, { twoFactorEnabled: true });
    // console.log("user =", user);

    if (!user)
      return {}

    console.log("auth controller status");
    return ({
      message: 'authorized',
      authorized: true,
      twoFactor: user.twoFactorEnabled,
    })
  }



  //loggingOut
  @UseGuards(JwtGuard)
  @Delete('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt', { httpOnly: true }).status(201).json({
      message: "Logedout Successfully",
    });
  }


  @UseGuards(JwtGuard)
  @Get('2fa/generate') // two factor button on 
  async generateTwoFactor(@Req() req) {
    // i need the username and i have to generate a generateTwoFactAuthSecret using authenticator
    const user: any = req.user;
    // console.log(req);
    const secret = await authenticator.generateSecret();
    const otpauthUrl = await authenticator.keyuri(user.email, 'FT_TRANS', secret); //  debug

    // console.log("secret = ", secret);
    const test = await this.userservice.update(user.sub, { twoFactor: secret });

    // console.log(test);
    // console.log("_______________________", otpauthUrl + "\n\n\n");

    //generateQrCodeDataURL
    return toDataURL(otpauthUrl);
    // change this when linking with front 

    // res.status(201).json({hamid: "rajol"})
    // return user;
    // console.log(secret);
    // const updateSecret = this.userservice.updateSecret(/*user id && secret */);
    // now we generate a qr code
    // To do this, we’ll use the qrcode module.
    // const otp = authenticator.keyuri(/*user, "OUR TFA APP" , secret*/)

    // and then Url to qr code using tofilestream
  }

  @Post('2fa/turn-on')
  @UseGuards(JwtGuard)
  async turnOnTwoFactAuth(@Req() req: AuthReq, @Res({ passthrough: true }) res, @Body() body) {

    // console.log(body);
    const user = await this.userservice.findOne(req.user?.sub, { twoFactor: true });
    const isCodeValid = await this.authservice.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      user,
    );
    // if the code is wrong 
    // execption handling will be changed
    if (!isCodeValid) {

      return ({
        twoFactor: false,
        message: "invalid two factor code",
      })
    }
    // only if the code is right 
    await this.userservice.update(req.user.sub, { twoFactorEnabled: true })
    return {
      twoFactor: true,
      message: "two factor turned on successfully",
    }
  }


  @Post('2fa/turn-off')
  @UseGuards(JwtGuard)
  async turnOfTwoFactAuth(@Req() req: AuthReq, @Res({ passthrough: true }) res) {
    // const user = await this.userservice.findOne(req.user.sub)

    await this.userservice.update(req.user.sub, { twoFactorEnabled: false });
    return {
      twoFactor: false,
      message: "two factor turned off successfully"
    }
  }


  /*login with 2fac */
  @Post('otp')
  @UseGuards(JwtGuard)
  async LoginOtp(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body('twoFactorAuthenticationCode') token: string
  ) {

    res.clearCookie('jwt', { httpOnly: true });

    const user = await this.userservice.findOne(req.user.sub);
    const accessToken = await this.authservice.login42(req.user);
    const isVAlidCode = this.authservice.isTwoFactorAuthenticationCodeValid(token, user)

    console.log("otp = ", token);

    if (isVAlidCode)
      res.cookie('jwt', accessToken, { httpOnly: true })
        .redirect(process.env.CLIENT_URL + '/home')

    return ({
      twoFactor: false,
      message: "invalid two factor code",
    })
  }


/* JWT TWO FACTOR GUARD WILL BE USED WHEN TRYING TO VALIDATE THE 2fa */
}
