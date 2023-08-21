import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        return { ...token, user, profile };
      }
      return token;
    },

    async session({ session, token, user }) {
      return { ...session, ...token };
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (!credentials?.username) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });
        const isValid = user?.password === credentials?.password;

        if (user && isValid) {
          return { id: user.id.toString(), username: user.username };
        } else {
          return null;
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
