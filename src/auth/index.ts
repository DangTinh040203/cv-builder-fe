import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { Env } from "@/configs/env.config";
import { type Tokens } from "@/services/auth.service";
import { type User } from "@/types/user.type";

/*
 * First time login
 * authorize -> signIn -> jwt -> session
 *
 * Subsequent logins
 * jwt -> session
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
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

          const { accessToken, refreshToken } = data;

          const { data: user } = await axios.get<User>("/user/profile", {
            baseURL: Env.NEXT_PUBLIC_BASE_URL,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          return {
            ...user,
            accessToken,
            refreshToken,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      return session;
    },
  },
});
