import { Injectable , ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";



@Injectable()
export class FortyTwoGuard extends AuthGuard('42') {
    // async canActivate(context: ExecutionContext): Promise<boolean> {
    //     const activate: boolean = (await super.canActivate(context)) as boolean;
    //     const request: Request = context.switchToHttp().getRequest();
    //     await super.logIn(request);
    //     return activate;
    // }
}