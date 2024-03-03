import { Injectable } from "@nestjs/common";
import { User } from "./user.entity"

export class SelectUser {
  id: boolean = true;
  email: boolean = true;
  username: boolean = true;
  name: boolean = true;
  avatar: boolean = true;

  twoFactor: boolean = false;
  twoFactorEnabled: boolean = false
}
