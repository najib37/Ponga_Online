import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Strategy } from 'passport-local';


@Injectable()
export class GoogleGuard extends AuthGuard('google')  {
    
}