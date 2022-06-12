import 'next-auth';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
}

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }

  interface Session {
    tokenData: TokenData;
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
    tokenData: TokenData;
  }
}
