import { getDb } from '../db.js';
import { requireSuperAdmin } from '../_auth.js';

export default async function handler(req, res) {
  // 슈퍼관리자 인증 확인
  const admin = requireSuperAdmin(req, res);
  if (!admin) return;

  const { id } = req.query;
  const sql = getDb();

  // DELETE - 직원 삭제
  if (req.method === 'DELETE') {
    try {
      // 해당 직원이 담당하는 신청 연결 해제
      await sql`
        UPDATE applications SET assigned_to = NULL WHERE assigned_to = ${id}
      `;

      // 직원 삭제 (staff 역할만)
      const result = await sql`
        DELETE FROM admins WHERE id = ${id} AND role = 'staff'
        RETURNING id
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: '직원을 찾을 수 없습니다.' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('DELETE staff error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
