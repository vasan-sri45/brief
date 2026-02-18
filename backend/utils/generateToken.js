// // utils/auth/generateToken.js
// import jwt from 'jsonwebtoken';

// const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000; 

// const isProd = process.env.NODE_ENV === 'production';
// const cookieName = isProd ? '__Host-jwt' : 'jwt'; 

// const generateToken = (userId, res) => {
//   const secret = process.env.JWT_SECRET_KEY; 
//   if (!secret) throw new Error('JWT secret missing');

//   const token = jwt.sign(
//     { sub: String(userId) },          
//     secret,
//     {
//       expiresIn: '15d',               
//       issuer: process.env.JWT_ISSUER || 'my-app',
//       audience: process.env.JWT_AUDIENCE || 'my-app-users',
//       algorithm: 'HS256',             
//     }
//   );

//   res.cookie(cookieName, token, {
//     httpOnly: true,                   
//     secure: isProd ? true : false,                
//     sameSite: isProd ? 'None' : 'Lax',                 
//     path: '/',                        
//     maxAge: FIFTEEN_DAYS_MS,          
//   });

//   return token;
// };

// export default generateToken;


// export const clearAuthCookie = (res) => {
//   const isProd = process.env.NODE_ENV === 'production';
//   const name = isProd ? '__Host-jwt' : 'jwt';
//   res.clearCookie(name, { httpOnly: false, secure: isProd, sameSite: 'Lax', path: '/' });
// };



import jwt from "jsonwebtoken";

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

// Detect environment
const isProd = process.env.NODE_ENV === "production";

// Cookie name (__Host- prefix allowed only in HTTPS + path=/)
const COOKIE_NAME = isProd ? "__Host-jwt" : "jwt";

/**
 * Create JWT and send httpOnly cookie
 */
const generateToken = (userId, res) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT secret missing");
  }

  // Create token
  const token = jwt.sign(
    { sub: String(userId) },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
      issuer: process.env.JWT_ISSUER || "briefcasse",
      audience: process.env.JWT_AUDIENCE || "briefcasse-users",
      algorithm: "HS256",
    }
  );

  // Send cookie
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,

    // IMPORTANT:
    // production (HTTPS) → true
    // localhost → false
    secure: isProd,

    // IMPORTANT:
    // cross-site requires None
    // localhost requires Lax
    sameSite: isProd ? "None" : "Lax",

    path: "/",

    maxAge: FIFTEEN_DAYS_MS,
  });

  return token;
};

export default generateToken;


/**
 * Logout — remove cookie
 * MUST match options used while creating cookie
 */
export const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/",
  });
};
