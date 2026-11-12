import { Request, Response } from 'express';
import { authService } from '../../services/auth/auth.service.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Ilagay ang email at password.'
      });
    }

    const result = await authService.login(email, password);

    return res.json({
      success: true,
      message: 'Login successful!',
      ...result
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};