import { type DefaultSession, type DefaultUser } from "next-auth";
import { type JWT } from "next-auth/jwt";

import { type User as AppUser } from "@/types/user.type";

declare module "next-auth" {
  interface User extends AppUser, DefaultUser {
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends AppUser {
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth" {
  interface Session extends JWT, DefaultSession {}
}
