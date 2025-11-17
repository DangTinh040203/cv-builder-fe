import axios from "axios";
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { Env } from "@/configs/env.config";
import { type Tokens } from "@/services/auth.service";
import { type JwtDecodedPayload, type NextAuthUser } from "@/types/next-auth";
import { type User } from "@/types/user.type";

let refreshPromise: Promise<void> | null = null;
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
        // First login
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

        // Still valid
        if (token.expiresAt && now < token.expiresAt) {
          return { ...token, isExpired: false };
        }

        // Refresh process already failed, bail out early to avoid loops
        if (token.isExpired) {
          return { ...token, isExpired: true };
        }

        // No refresh token?
        if (!token.refreshToken) {
          return { ...token, isExpired: true };
        }

        // Decode refresh token safely
        let rtDecoded: JwtDecodedPayload;
        try {
          rtDecoded = jwtDecode<JwtDecodedPayload>(token.refreshToken);
        } catch {
          return { ...token, isExpired: true };
        }

        if (now > rtDecoded.exp) {
          return { ...token, isExpired: true };
        }

        // 🔄 REFRESH TOKEN WITH LOCK
        if (!refreshPromise) {
          refreshPromise = axios
            .post<Tokens>(
              `/auth/refresh-token`,
              {},
              {
                baseURL: Env.NEXT_PUBLIC_BASE_URL,
                headers: {
                  Authorization: `Bearer ${token.refreshToken}`,
                },
              },
            )
            .then((response) => {
              const data = response.data;
              const decoded = jwtDecode<JwtDecodedPayload>(data.accessToken);

              token.accessToken = data.accessToken;
              token.refreshToken = data.refreshToken;
              token.expiresAt = decoded.exp;
              token.isExpired = false;
              token.user = {
                ...token.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              };
            })
            .catch(() => {
              token.isExpired = true;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;

        return { ...token };
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
