// middlewares/auth.js
import { verifyAccessToken } from '../utils/auth/jwt.js';
import { getAuthCookieName } from '../utils/auth/cookies.js';
import User from '../models/auth/user.js';
import Employee from '../models/auth/employee.js';

const protectFactory = (Model) => async (req, res, next) => {
  try {
    const cookieName = getAuthCookieName();
    const token = req.cookies?.[cookieName];
    if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });

    const decoded = verifyAccessToken(token); // { sub, iat, exp, iss, aud, ... }
    const id = decoded.sub;

    // Fetch only what is needed for authorization
    const user = await Model.findById(id).select('_id name email mobile role status');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid user' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token expired' });
    if (err.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid token' });
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

export const userProtectRoute = protectFactory(User);
export const employeeProtectRoute = protectFactory(Employee);

export const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Admin access required' });
};

export const allowEmployeesAndAdmins = (req, res, next) => {
  const allowedRoles = ['employee', 'admin'];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
  }
  next();
};


export const allowRoles = (rolesArray) => (req, res, next) => {
  if (!rolesArray.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Insufficient role.' });
  }
  next();
};
