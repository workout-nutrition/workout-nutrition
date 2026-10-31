import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { logger } from '../config/logger.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const ADMIN_EMAILS = [
  'ronit201103@gmail.com',
  'jk011103@gmail.com',
  'jk011103jk@gmail.com',
  'tushar@gmail.com',
];

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Missing token' });
    return;
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
      return;
    }

    // Fetch user profile to verify role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isEmailAdmin = Boolean(user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));
    req.user = {
      id: user.id,
      email: user.email || '',
      role: profile?.role === 'admin' || isEmailAdmin ? 'admin' : 'customer',
    };

    next();
  } catch (err) {
    logger.error({ err }, 'Error validating Supabase auth token');
    res.status(500).json({ error: 'Internal auth validation error' });
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) return next();

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const isEmailAdmin = Boolean(user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));
      req.user = {
        id: user.id,
        email: user.email || '',
        role: profile?.role === 'admin' || isEmailAdmin ? 'admin' : 'customer',
      };
    }
  } catch {
    // Ignore and treat as unauthenticated
  }

  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized: Authentication required' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Administrator privileges required' });
    return;
  }

  next();
}
