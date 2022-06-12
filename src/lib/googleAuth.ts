import { TokenData } from '~/types/next-auth';

export const refreshAccessToken = async (token: TokenData): Promise<TokenData> => {
  try {
    const url =
      'https://oauth2.googleapis.com/token?' +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
      });

    const response = await fetch(url, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    });
    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken
    };
  } catch (err) {
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
};
