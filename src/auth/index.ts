import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
      authorize: async ({ email, password }) => {
        try {
          return {
            id: "1",
            name: "John Doe",
            email: "<Email>",
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});
