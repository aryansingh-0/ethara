import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/envConfig.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: 'You are not Authorized. Please log in again.' });
    }

    // Single session logic: check if the session token matches the one in DB
    if (currentUser.activeSessionToken !== decoded.sessionToken) {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'You are not Authorized. Please log in again.' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

