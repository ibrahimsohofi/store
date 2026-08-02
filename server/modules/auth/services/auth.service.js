import jwt from 'jsonwebtoken';
import { authRepo } from '../repos/auth.repo.js';
import { env } from '../../../config/env.js';

export const authService = {
  async register(data) {
    const existingUser = await authRepo.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await authRepo.createUser(data);
    
    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();
    
    await authRepo.createRefreshToken(user.id, refreshToken, env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60);
    
    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  },

  async login(email, password) {
    const user = await authRepo.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await authRepo.verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();
    
    await authRepo.createRefreshToken(user.id, refreshToken, env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60);
    
    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  },

  async refresh(refreshToken) {
    const tokenRecord = await authRepo.findRefreshToken(refreshToken);
    if (!tokenRecord) {
      throw new Error('Invalid refresh token');
    }

    const user = await authRepo.findUserById(tokenRecord.user_id);
    if (!user || !user.is_active) {
      throw new Error('User not found or inactive');
    }

    // Generate new tokens
    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken();
    
    // Delete old refresh token and create new one
    await authRepo.deleteRefreshToken(refreshToken);
    await authRepo.createRefreshToken(user.id, newRefreshToken, env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60);
    
    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(refreshToken) {
    await authRepo.deleteRefreshToken(refreshToken);
    return { success: true };
  },

  async logoutAll(userId) {
    await authRepo.deleteAllRefreshTokens(userId);
    return { success: true };
  },

  async updateProfile(userId, data) {
    const user = await authRepo.updateUser(userId, data);
    return this.sanitizeUser(user);
  },

  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: 'customer',
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.ACCESS_TOKEN_TTL }
    );
  },

  generateRefreshToken() {
    return jwt.sign({}, env.JWT_REFRESH_SECRET, { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` });
  },

  sanitizeUser(user) {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  },
};
