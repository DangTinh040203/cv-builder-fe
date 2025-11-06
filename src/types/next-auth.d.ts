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
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: NextAuthUser;
  }
}

export interface JwtDecodedPayload {
  _id: string;
  iat: number;
  exp: number;
}
