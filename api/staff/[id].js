import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { requireSuperAdmin } from '../_auth.js';

// 전화번호 정규화
const normalizePhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

export default async function handler(req, res) {
  // 슈퍼관리자 인증 확인
  const admin = requireSuperAdmin(req, res);
  if (!admin) return;

  const { id } = req.query;
  const sql = getDb();

  // GET - 직원 상세 조회
  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT id, name, phone, email, created_at
        FROM admins
        WHERE id = ${id} AND role = 'staff'
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: '직원을 찾을 수 없습니다.' });
      }

      return res.status(200).json({ staff: result[0] });
    } catch (error) {
      console.error('GET staff error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // PATCH - 직원 정보 수정
  if (req.method === 'PATCH') {
    try {
      const { name, phone, newPassword } = req.body;

      // 기존 직원 확인
      const existing = await sql`
        SELECT id FROM admins WHERE id = ${id} AND role = 'staff'
      `;
      if (existing.length === 0) {
        return res.status(404).json({ error: '직원을 찾을 수 없습니다.' });
      }

      // 비밀번호 재설정
      if (newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await sql`
          UPDATE admins SET password_hash = ${passwordHash} WHERE id = ${id}
        `;
        return res.status(200).json({ success: true, message: '비밀번호가 재설정되었습니다.' });
      }

      // 직원 정보 수정
      if (name || phone) {
        const normalizedPhone = phone ? normalizePhone(phone) : null;

        // 전화번호 중복 확인 (본인 제외)
        if (normalizedPhone) {
          const phoneExists = await sql`
            SELECT id FROM admins WHERE phone = ${normalizedPhone} AND id != ${id}
          `;
          if (phoneExists.length > 0) {
            return res.status(409).json({ error: '이미 등록된 전화번호입니다.' });
          }
        }

        await sql`
          UPDATE admins
          SET name = COALESCE(${name}, name),
              phone = COALESCE(${normalizedPhone}, phone)
          WHERE id = ${id}
        `;

        const updated = await sql`
          SELECT id, name, phone, email, created_at FROM admins WHERE id = ${id}
        `;

        return res.status(200).json({ success: true, staff: updated[0] });
      }

      return res.status(400).json({ error: '수정할 정보를 입력해주세요.' });
    } catch (error) {
      console.error('PATCH staff error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

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
