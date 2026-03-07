import { getDb } from '../db.js';
import { requireAdmin } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 관리자 토큰 검증
  const admin = requireAdmin(req, res);
  if (!admin) return;

  try {
    const sql = getDb();

    // DB에서 관리자 정보 조회
    const admins = await sql`
      SELECT id, email, name, created_at
      FROM admins
      WHERE id = ${admin.adminId}
    `;

    if (admins.length === 0) {
      return res.status(404).json({ error: '관리자를 찾을 수 없습니다.' });
    }

    const adminData = admins[0];

    return res.status(200).json({
      admin: {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
        createdAt: adminData.created_at
      }
    });

  } catch (error) {
    console.error('Admin me error:', error);
    return res.status(500).json({ error: '관리자 정보 조회 중 오류가 발생했습니다.' });
  }
}
