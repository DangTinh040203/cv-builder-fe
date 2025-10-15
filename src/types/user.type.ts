import { type User as AppUser } from "@/types/user.type";

declare module "next-auth" {
  interface User extends AppUser {
    accessToken: string;
    refreshToken: string;
  }
}

export interface User {
  _id: string;
  displayName: string;
  avatar: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}
