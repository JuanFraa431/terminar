import { EntityManager } from '@mikro-orm/core';
import { Request, Response, NextFunction } from 'express';

export const withEm = (
  em: EntityManager,
  handler: (em: EntityManager, req: Request, res: Response) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(em, req, res).catch(next);
  };
};
