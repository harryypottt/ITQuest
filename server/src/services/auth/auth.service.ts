import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository, User } from '../../repositories/user.repository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_access_token_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret';

export interface RegisterInput {
  email: string;
  password: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  student_id?: string;
  specialization?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  // 1. REGISTER USER
  async register(userData: RegisterInput): Promise<AuthResponse> {
    const nameToUse = (userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`).trim();
    if (!nameToUse) {
      throw new Error('Kailangan ang pangalan.');
    }

    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('May account na gamit ang email na ito.');
    }

    const totalUsers = await userRepository.countUsers();
    const nextNum = (totalUsers + 1).toString().padStart(3, '0');
    const userId = `u-${nextNum}`;

    const nameParts = nameToUse.split(' ').filter(Boolean);
    const avatar_initials = nameParts.length >= 2
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
      : nameToUse.substring(0, 2).toUpperCase();

    const password_hash = await bcrypt.hash(userData.password, 10);

    const newUser = await userRepository.create({
      id: userId,
      name: nameToUse,
      email: userData.email,
      password_hash,
      role: userData.role || 'student',
      student_id: userData.student_id || null,
      specialization: userData.specialization || null,
    });

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    const { password_hash: _, ...userWithoutPassword } = newUser;

    // INAYOS: Ginamit ang `userId` sa halip na `id` para mag-match sa middleware
    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: userWithoutPassword as User,
      accessToken,
      refreshToken,
    };
  },

  // 2. LOGIN USER
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password_hash) {
      throw new Error('Maling email o password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Maling email o password.');
    }

    if (user.status === 'inactive' || user.status === 'banned') {
      throw new Error('Account is inactive or suspended.');
    }

    const { password_hash: _, ...userWithoutPassword } = user;

    // INAYOS: Ginamit ang `userId` sa halip na `id`
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: userWithoutPassword as User,
      accessToken,
      refreshToken,
    };
  },

  // 3. REFRESH ACCESS TOKEN
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // INAYOS: `userId` na ang sine-check mula sa decoded refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };

      const user = await userRepository.findById(decoded.userId);
      if (!user || user.status === 'inactive') {
        throw new Error('User not found or account disabled');
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }
  },

  // 4. LOGOUT USER
  async logout(refreshToken?: string): Promise<boolean> {
    return true;
  },

  // 5. CHANGE PASSWORD
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user || !user.password_hash) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('Incorrect current password');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    return await userRepository.updatePassword(userId, newPasswordHash);
  },

  // 6. GET CURRENT USER PROFILE
  async getCurrentUser(userId: string): Promise<Omit<User, 'password_hash'>> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },
};