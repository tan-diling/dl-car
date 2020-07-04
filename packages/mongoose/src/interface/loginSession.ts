import { Types } from "mongoose";

export interface ILoginSession {
    device: string;
  
    accessToken: string;
    refreshToken: string;
    lastAccessTime: Date;
    refreshExpireTime: Date;
    ip: string;
    user: Types.ObjectId;
  }