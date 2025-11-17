import { type DefaultSession } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";

import { type User } from "@/types/user.type";

export interface NextAuthUser extends User {
  accessToken: string;
  refreshToken: string;
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: NextAuthUser | null;
    isExpired: boolean;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: number | null;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: NextAuthUser | null;
    isExpired: boolean;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: number | null;
  }
}

export interface JwtDecodedPayload {
  _id: string;
  iat: number;
  exp: number;
}
