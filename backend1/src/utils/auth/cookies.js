// utils/cookies.js
const isProd = process.env.NODE_ENV === 'production';

export const getAuthCookieName = () => (isProd ? '__Host-jwt' : 'jwt');

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: isProd,     // must be true for __Host- prefix
  sameSite: isProd ? 'None' : 'Lax',
  path: '/',          // required for __Host- prefix
});
