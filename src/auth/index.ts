import axios from "axios";
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { Env } from "@/configs/env.config";
import { type Tokens } from "@/services/auth.service";
import { type JwtDecodedPayload } from "@/types/next-auth";
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
      if (token.user || user) {
        const nextAuthUser = token.user || user;

        const decodedToken = jwtDecode<JwtDecodedPayload>(
          nextAuthUser.accessToken,
        );

        const exp = decodedToken.exp * 1000; // convert to ms
        const now = Date.now();
        const FIVE_MINUTES = 5 * 60 * 1000;

        const isExpired = exp - now <= FIVE_MINUTES;

        if (isExpired) {
          const { data } = await axios.post<Tokens>(
            "/auth/refresh-token",
            {},
            {
              baseURL: Env.NEXT_PUBLIC_BASE_URL,
              headers: {
                Authorization: `Bearer ${nextAuthUser.refreshToken}`,
              },
            },
          );

          token.user = {
            ...nextAuthUser,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } else {
          token.user = {
            ...nextAuthUser,
          };
        }
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
