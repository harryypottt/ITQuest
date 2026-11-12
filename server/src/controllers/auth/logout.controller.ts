import { Request, Response } from 'express';

export const logout = async (req: Request, res: Response) => {
  try {
    // Kapag gagamit ka na ng HTTP-only cookies o token blacklist, dito nililinis 'yun.
    // Sa ngayon, ipinapaalam sa client na matagumpay ang logout para mailabas/mabura ang token sa frontend storage.
    return res.status(200).json({
      success: true,
      message: 'Successfully logged out.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};