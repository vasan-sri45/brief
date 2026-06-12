// utils/auth/jwt.js
import jwt from 'jsonwebtoken';

const isProd = process.env.NODE_ENV === 'production';
export const getAuthCookieName = () => (isProd ? '__Host-jwt' : 'jwt');

const jwtVerifyOptions = {
  algorithms: ['HS256'],
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
};

export const verifyAccessToken = (token) => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) throw new Error('JWT secret missing');
  return jwt.verify(token, secret, jwtVerifyOptions); // throws on invalid/expired/iss/aud mismatch
};
