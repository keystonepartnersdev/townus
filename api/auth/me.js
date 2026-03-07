import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'townus-secret-key-change-in-production';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    const token = authHeader.substring(7);

    // 토큰 검증
    const decoded = jwt.verify(token, JWT_SECRET);

    const sql = getDb();

    // 사용자 정보 조회
    const users = await sql`
      SELECT id, phone, company_name, name, created_at
      FROM users
      WHERE id = ${decoded.userId}
    `;

    if (users.length === 0) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    const user = users[0];

    return res.status(200).json({
      user: {
        id: user.id,
        phone: user.phone,
        companyName: user.company_name,
        name: user.name,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }
    console.error('Auth me error:', error);
    return res.status(500).json({ error: '인증 확인 중 오류가 발생했습니다.' });
  }
}
