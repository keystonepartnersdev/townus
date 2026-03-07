import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'townus-secret-key-change-in-production';

export const verifyToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const requireAuth = (req, res) => {
  const user = verifyToken(req);

  if (!user) {
    res.status(401).json({ error: '인증이 필요합니다.' });
    return null;
  }

  return user;
};

export const requireAdmin = (req, res) => {
  const admin = verifyToken(req);

  if (!admin || admin.type !== 'admin') {
    res.status(403).json({ error: '관리자 권한이 필요합니다.' });
    return null;
  }

  return admin;
};

export const requireSuperAdmin = (req, res) => {
  const admin = verifyToken(req);

  if (!admin || admin.type !== 'admin') {
    res.status(403).json({ error: '관리자 권한이 필요합니다.' });
    return null;
  }

  if (admin.role !== 'super_admin') {
    res.status(403).json({ error: '슈퍼관리자 권한이 필요합니다.' });
    return null;
  }

  return admin;
};
