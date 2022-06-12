import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { refreshAccessToken } from '~/lib/googleAuth';

const GOOGLE_AUTHORISATION_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
    scope:
      'openid https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile'
  });

const prisma = new PrismaClient();

export default NextAuth({
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: GOOGLE_AUTHORISATION_URL
    })
  ],
  callbacks: {
    async jwt({ token, account, user, isNewUser }) {
      if (isNewUser && user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            timers: [
              { name: '30 seconds', playtime: 30000, default: true },
              { name: 'indefinite', playtime: 0, default: false }
            ]
          }
        });
      }
      // Initial sign in
      if (account && user) {
        token.tokenData = {
          accessToken: account.access_token!,
          accessTokenExpires: Date.now() + account.expires_at! * 1000,
          refreshToken: account.refresh_token!
        };
        token.user = user;
      }

      // refresh access token if expired
      if (Date.now() > token.tokenData.accessTokenExpires) {
        const tokenData = await refreshAccessToken(token.tokenData);
        token.tokenData = tokenData;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.tokenData = token.tokenData;
      session.error = token.error;

      return session;
    }
  }
});
