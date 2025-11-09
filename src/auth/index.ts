import axios from "axios";
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { Env } from "@/configs/env.config";
import { type Tokens } from "@/services/auth.service";
import { type JwtDecodedPayload, type NextAuthUser } from "@/types/next-auth";
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
    async jwt({ token, user }) {
      try {
        if (user) {
          const nextAuthUser = user as NextAuthUser;
          const decoded = jwtDecode<JwtDecodedPayload>(
            nextAuthUser.accessToken,
          );

          return {
            ...token,
            accessToken: nextAuthUser.accessToken,
            refreshToken: nextAuthUser.refreshToken,
            expiresAt: decoded.exp,

            user: nextAuthUser,
            isExpired: false,
          };
        }

        const now = Math.floor(Date.now() / 1000);
        const bufferTime = 5 * 60;

        if (token.expiresAt && now + bufferTime < token.expiresAt) {
          return { ...token, isExpired: false };
        }

        if (!token.refreshToken) {
          return { ...token, isExpired: true };
        }

        const rtDecoded = jwtDecode<JwtDecodedPayload>(token.refreshToken);
        if (now > rtDecoded.exp) {
          return { ...token, isExpired: true };
        }

        // 🔄 REFRESH
        const { data } = await axios.post<Tokens>(
          `/auth/refresh-token`,
          {},
          {
            baseURL: Env.NEXT_PUBLIC_BASE_URL,
            headers: {
              Authorization: `Bearer ${token.refreshToken}`,
            },
          },
        );

        const decoded = jwtDecode<JwtDecodedPayload>(data.accessToken);
        const newToken = {
          ...token,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: decoded.exp,
          isExpired: false,
          user: {
            ...token.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          },
        };

        return newToken;
      } catch {
        return { ...token, isExpired: true };
      }
    },

    async session({ session, token }) {
      return {
        ...session,
        user: token.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        isExpired: token.isExpired,
        expiresAt: token.expiresAt,
      };
    },
  },

  session: {
    strategy: "jwt",
    updateAge: 0,
  },
});
