import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) token.provider = account.provider;
      if (profile && typeof profile === "object") {
        const anyProfile = profile as Record<string, any>;
        token.name ??= anyProfile.name;
        token.picture ??= anyProfile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).provider = (token as any).provider;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

// ✅ Only export GET and POST — do not export authOptions
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
