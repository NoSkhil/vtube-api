import { Response, NextFunction } from 'express';
import userService from '../services/userService';
import { randomBytes } from 'crypto';
import { PublicRequest } from '../types/requestTypes';

const sessionManagement = async (
  req: PublicRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.session.userId) {
      const user = await userService.getUserById(req.session.userId);
      if (user.success) req.user = user.data;
      else req.session.userId = undefined;
    }

    if (!req.session.tempUserId) {
      req.session.tempUserId = randomBytes(16).toString('hex');
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export default sessionManagement;
