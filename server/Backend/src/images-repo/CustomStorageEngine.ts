import { StorageEngine } from "multer"
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";


export class MyCustomStorageEngine implements StorageEngine {
  constructor(
    private readonly Directory: string = "./upload/"
  ) { }

  _handleFile(req: Request, file, cb) {

    const fileSize = parseInt(req.headers["content-length"]);
    if (!file.mimetype.includes('image'))
      return cb(
        new HttpException({ status: HttpStatus.UNPROCESSABLE_ENTITY, error: 'Incorrect Mimetype' }, HttpStatus.FORBIDDEN)
      )
    if (fileSize >= 1e6)
      return cb(
        new HttpException(
          { status: HttpStatus.UNPROCESSABLE_ENTITY, error: 'Exeeded Max Size' },
          HttpStatus.FORBIDDEN
        )
      )

    // const imageUuid = randomUUID()
    const fileName = randomUUID() + path.extname(file.originalname);
    const imagePath = this.Directory + fileName;
    fs.mkdirSync("." + this.Directory, { recursive: true });
    let outStream = fs.createWriteStream("." + imagePath)

    file.stream.pipe(outStream)
    outStream.on('error', cb)
    outStream.on('finish', function () {
      cb(null, {
        path: imagePath,
        size: outStream.bytesWritten
      })
    })
  }

  _removeFile(req, file, cb) {
    return cb(
      new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'Unauthorized' },
        HttpStatus.FORBIDDEN
      )
    )
  }
}
