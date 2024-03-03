import { Controller, Get,  Param,  ParseFilePipe,  Post, Req, Res ,UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ImagesRepoService } from './images-repo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyCustomStorageEngine } from './CustomStorageEngine'
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guard/jwt.guards';
import { AuthReq } from 'src/user/types/AuthReq';

@Controller('upload')
@UseGuards(JwtGuard)
export class ImagesRepoController {
  constructor(
    private readonly imagesRepoService: ImagesRepoService,
    private readonly userService: UserService
  ) { }

  @Post('/avatar/')
  @UsePipes(ParseFilePipe)
  @UseInterceptors(
    FileInterceptor(
      'file',
      { storage: new MyCustomStorageEngine("/upload/avatar/") }
    )
  )
  uploadAvatar(
    @Req() req: AuthReq,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = req.user.sub || '';
    return this.userService.update(userId, { avatar: file.path })
  }

  @Post('/background/')
  @UsePipes(ParseFilePipe)
  @UseInterceptors(
    FileInterceptor(
      'file',
      { storage: new MyCustomStorageEngine("/upload/background/") }
    )
  )
  uploadBackGround(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthReq,
  ) {
    const userId = req.user.sub || '';
    return this.userService.update(userId, { avatar: file.path })
  }

  @Get(":bucket/:imageName")
  getImage(
    @Res() res: Response,
    @Param('bucket') bucket: string,
    @Param('imageName') imageName: string,
  ) {
    this.imagesRepoService.getImageById(res, bucket, imageName);
  }
}
