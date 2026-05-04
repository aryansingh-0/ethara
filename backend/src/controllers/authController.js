import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import sendEmail from '../utils/email.js';
import { config } from '../config/envConfig.js';

const signToken = (id, sessionToken) => {
  return jwt.sign({ id, sessionToken }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ 'userCredentials.email': email });
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      }
      // Overwrite unverified user's details
      user.name = name;
      user.userCredentials.password = password;
      if (role) user.role = role;
      await user.save();
    } else {
      user = await User.create({
        name,
        userCredentials: {
          email,
          password
        },
        role: role || 'Member',
        isVerified: false
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const token = crypto.randomBytes(32).toString('hex');

    await Otp.deleteMany({ userId: user._id }); // Clear existing OTPs

    await Otp.create({
      userId: user._id,
      otp: hashedOtp,
      token,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
    });

    const message = `Your signup verification OTP is: ${otp}. It is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.userCredentials.email,
        subject: 'Verify your email address',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'OTP sent to email. Please verify to complete signup.',
        token
      });
    } catch (error) {
      console.error('Email Error:', error);
      await Otp.deleteMany({ userId: user._id });
      return res.status(500).json({ message: 'There was an error sending the verification email. Try again later!' });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const verifySignup = async (req, res) => {
  try {
    const { token, otp } = req.body;

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const otpRecord = await Otp.findOne({
      token,
      otp: hashedOtp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP is invalid or has expired' });
    }

    const user = await User.findById(otpRecord.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.isVerified = true;
    
    // Auto login after verification
    const sessionToken = crypto.randomBytes(32).toString('hex');
    user.activeSessionToken = sessionToken;

    await user.save();
    
    // Delete the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    const jwtToken = signToken(user._id, sessionToken);

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully. You are now logged in.',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.userCredentials.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ 'userCredentials.email': email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first before logging in' });
    }

    // Generate a new session token to invalidate previous sessions
    const sessionToken = crypto.randomBytes(32).toString('hex');
    user.activeSessionToken = sessionToken;
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id, sessionToken);

    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.userCredentials.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const user = req.user;
    user.activeSessionToken = null; // Invalidate session
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ 'userCredentials.email': email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email address.' });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP for security in database
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const token = crypto.randomBytes(32).toString('hex');

    await Otp.create({
      userId: user._id,
      otp: hashedOtp,
      token,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
    });

    const message = `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.userCredentials.email,
        subject: 'Your password reset OTP',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'OTP sent to email!',
        token // Send this token to the frontend so it can be used for verify/reset
      });
    } catch (error) {
      await Otp.deleteMany({ userId: user._id });

      return res.status(500).json({ message: 'There was an error sending the email. Try again later!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { token, otp } = req.body;

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const otpRecord = await Otp.findOne({
      token,
      otp: hashedOtp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP is invalid or has expired' });
    }

    res.status(200).json({
      status: 'success',
      message: 'OTP verified successfully. You can now reset your password.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, otp, newPassword } = req.body;

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const otpRecord = await Otp.findOne({
      token,
      otp: hashedOtp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP is invalid or has expired' });
    }

    const user = await User.findById(otpRecord.userId);
    user.userCredentials.password = newPassword;
    
    // Log the user out of all devices by generating a new session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    user.activeSessionToken = sessionToken;

    await user.save();
    
    // Delete the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    const jwtToken = signToken(user._id, sessionToken);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);

    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [
        { name: regex },
        { 'userCredentials.email': regex }
      ]
    })
    .select('name userCredentials.email')
    .limit(10);

    // Flatten output slightly for frontend convenience
    const formattedUsers = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.userCredentials.email
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
