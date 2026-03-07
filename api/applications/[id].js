import { getDb } from '../db.js';
import { requireAdmin } from '../_auth.js';

export default async function handler(req, res) {
  const sql = getDb();
  const { id } = req.query;

  // GET - 단일 신청 조회
  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT a.*, adm.name as assigned_staff_name
        FROM applications a
        LEFT JOIN admins adm ON a.assigned_to = adm.id
        WHERE a.id = ${parseInt(id)}
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }

      return res.status(200).json(result[0]);
    } catch (error) {
      console.error('GET application error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // PATCH - 신청 상태/담당자 업데이트 (관리자 인증 필요)
  if (req.method === 'PATCH') {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    try {
      const { status, assigned_to } = req.body;
      const isStaff = admin.role === 'staff';

      // staff는 자신에게 배정된 신청만 수정 가능
      if (isStaff) {
        const check = await sql`
          SELECT id FROM applications WHERE id = ${parseInt(id)} AND assigned_to = ${admin.adminId}
        `;
        if (check.length === 0) {
          return res.status(403).json({ error: '해당 신청에 대한 권한이 없습니다.' });
        }
      }

      // 담당자 배정은 super_admin만 가능
      if (assigned_to !== undefined && isStaff) {
        return res.status(403).json({ error: '담당자 배정은 슈퍼관리자만 가능합니다.' });
      }

      let result;
      if (assigned_to !== undefined && status !== undefined) {
        result = await sql`
          UPDATE applications
          SET status = ${status}, assigned_to = ${assigned_to}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${parseInt(id)}
          RETURNING *
        `;
      } else if (assigned_to !== undefined) {
        result = await sql`
          UPDATE applications
          SET assigned_to = ${assigned_to}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${parseInt(id)}
          RETURNING *
        `;
      } else if (status !== undefined) {
        result = await sql`
          UPDATE applications
          SET status = ${status}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${parseInt(id)}
          RETURNING *
        `;
      } else {
        return res.status(400).json({ error: '업데이트할 필드가 없습니다.' });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // 담당자 이름 포함해서 반환
      const updated = await sql`
        SELECT a.*, adm.name as assigned_staff_name
        FROM applications a
        LEFT JOIN admins adm ON a.assigned_to = adm.id
        WHERE a.id = ${parseInt(id)}
      `;

      return res.status(200).json(updated[0]);
    } catch (error) {
      console.error('PATCH application error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE - 신청 삭제 (관리자 인증 필요)
  if (req.method === 'DELETE') {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    // super_admin만 삭제 가능
    if (admin.role !== 'super_admin') {
      return res.status(403).json({ error: '삭제는 슈퍼관리자만 가능합니다.' });
    }

    try {
      const result = await sql`
        DELETE FROM applications WHERE id = ${parseInt(id)} RETURNING id
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('DELETE application error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
