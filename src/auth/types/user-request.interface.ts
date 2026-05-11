// src/auth/types/user-request.interface.ts
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    email?: string;
    preferred_username?: string;
    name?: string;
    [key: string]: any;
  };
}
