
import { Request } from "express";
import { AuthUser } from "./AuthUser";

export interface AuthReq extends Request {
  user: AuthUser;
}
