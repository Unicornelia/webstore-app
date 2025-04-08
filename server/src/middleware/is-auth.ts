import { NextFunction, Request, Response } from 'express';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.isAuthenticated) {
    return res.redirect(301, '/login');
  }
  next();
};
