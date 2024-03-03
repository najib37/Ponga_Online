import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as path from 'path';
import { Response } from "express"

@Injectable()
export class ImagesRepoService {
  constructor(
    private readonly userService: UserService
  ) {}

  getImageById( res: Response, bucket: string, imageName : string) {

    const fallbackPath = path.normalize(path.join(__dirname, '../../upload', bucket , imageName ))
    const Path = process.env.ROOT || fallbackPath;
    res.sendFile(Path);
  }
}
