import { type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

import { type User } from "@/types/user.type";

export interface NextAuthUser extends User {
  accessToken: string;
  refreshToken: string;
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: NextAuthUser;
    isExpired: boolean;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: NextAuthUser;
    isExpired: boolean;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }
}

export interface JwtDecodedPayload {
  _id: string;
  iat: number;
  exp: number;
}
