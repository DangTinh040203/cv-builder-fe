import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { Env } from "@/configs/env.config";
import { type Tokens } from "@/services/auth.service";
import { type NextAuthUser } from "@/types/next-auth";
import { type User } from "@/types/user.type";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (payload) => {
        try {
          const { data } = await axios.post<Tokens>(
            `/auth/sign-in/credentials`,
            payload,
            { baseURL: Env.NEXT_PUBLIC_BASE_URL },
          );

          const { accessToken } = data;

          const { data: user } = await axios.get<User>("/user/profile", {
            baseURL: Env.NEXT_PUBLIC_BASE_URL,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          return { ...user, ...data };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const nextAuthUser = user as NextAuthUser;
        token.user = {
          ...nextAuthUser,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: token.user,
      };
    },
  },
});
