import { Request } from 'express';
import { IUser } from './userTypes';
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    tempUserId?: string;
  }
}

export interface PublicRequest extends Request {
  user?: IUser;
}

export interface AuthenticatedRequest extends Request {
  user: IUser;
}