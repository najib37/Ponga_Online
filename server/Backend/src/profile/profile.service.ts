import { Injectable } from '@nestjs/common';
import { Profile } from './entities/Profile';
import { BlockService } from 'src/block/block.service';
import { FriendsService } from 'src/friends/friends.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly friendsService: FriendsService,
    private readonly blockService: BlockService,
    // private readonly : FriendsService,
  ) { }

  async getProfileByUsername(userId: string, username: string,): Promise<Profile> {
    if (!username)
      return;

    const user: User = await this.userService.findUserByUsername(username);

    if (!user)
      return;

    const [isFriend, isBlocked, friends] = await Promise.all([
      this.friendsService.isFriends(user?.id, userId),
      this.blockService.isBlocked(user?.id, userId),
      this.friendsService.getAllFriends(user?.id),
    ]);

    return {
      user,
      friends,
      isFriend,
      isBlocked,
    }
  }
  async getProfileById(userId: string, otherUserId: string,): Promise<any> {
    if (!userId || !otherUserId)
      return;

    const user: User = await this.userService.findOne(otherUserId);

    if (!user)
      return;

    const [isFriend, isBlocked, friends] = await Promise.all([
      this.friendsService.isFriends(user?.id, userId),
      this.blockService.getBlockState(user?.id, userId),
      this.friendsService.getAllFriends(user?.id),
    ]);

    return {
      user,
      isFriend,
      isBlocked,
    }
  }
}
