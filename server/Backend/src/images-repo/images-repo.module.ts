import { Module } from '@nestjs/common';
import { ImagesRepoService } from './images-repo.service';
import { ImagesRepoController } from './images-repo.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ImagesRepoController],
  providers: [ImagesRepoService],
})
export class ImagesRepoModule {}
