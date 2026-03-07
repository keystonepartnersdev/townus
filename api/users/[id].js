import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { requireAdmin, requireSuperAdmin } from '../_auth.js';

// 전화번호 정규화 (하이픈 포함 형식으로 통일)
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
  // 관리자 인증 확인
  const admin = requireAdmin(req, res);
  if (!admin) return;

  const { id } = req.query;
  const sql = getDb();

  // GET - 회원 상세 조회 (신청 내역 포함, 페이지네이션)
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 5 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const users = await sql`
        SELECT id, phone, company_name, name, created_at
        FROM users
        WHERE id = ${id}
      `;

      if (users.length === 0) {
        return res.status(404).json({ error: '회원을 찾을 수 없습니다.' });
      }

      // 전체 신청 수
      const totalResult = await sql`
        SELECT COUNT(*) as count FROM applications WHERE user_id = ${id}
      `;
      const total = parseInt(totalResult[0].count);

      // 페이지네이션 적용된 신청 내역
      const applications = await sql`
        SELECT id, company_name, manager_name, phone_number, site_address, status, created_at
        FROM applications
        WHERE user_id = ${id}
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${offset}
      `;

      return res.status(200).json({
        user: users[0],
        applications,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error('GET user error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // PATCH - 회원 정보 수정 (슈퍼관리자 전용)
  if (req.method === 'PATCH') {
    const superAdmin = requireSuperAdmin(req, res);
    if (!superAdmin) return;

    try {
      const { companyName, name, phone, newPassword } = req.body;

      // 기존 회원 확인
      const existing = await sql`SELECT id FROM users WHERE id = ${id}`;
      if (existing.length === 0) {
        return res.status(404).json({ error: '회원을 찾을 수 없습니다.' });
      }

      // 비밀번호 재설정
      if (newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await sql`
          UPDATE users SET password_hash = ${passwordHash} WHERE id = ${id}
        `;
        return res.status(200).json({ success: true, message: '비밀번호가 재설정되었습니다.' });
      }

      // 회원 정보 수정
      if (companyName || name || phone) {
        const normalizedPhone = phone ? normalizePhone(phone) : null;

        // 전화번호 중복 확인 (본인 제외)
        if (normalizedPhone) {
          const phoneExists = await sql`
            SELECT id FROM users WHERE phone = ${normalizedPhone} AND id != ${id}
          `;
          if (phoneExists.length > 0) {
            return res.status(409).json({ error: '이미 등록된 전화번호입니다.' });
          }
        }

        // 동적 업데이트
        const updates = [];
        if (companyName) updates.push(sql`company_name = ${companyName}`);
        if (name) updates.push(sql`name = ${name}`);
        if (normalizedPhone) updates.push(sql`phone = ${normalizedPhone}`);

        if (updates.length > 0) {
          await sql`
            UPDATE users
            SET company_name = COALESCE(${companyName}, company_name),
                name = COALESCE(${name}, name),
                phone = COALESCE(${normalizedPhone}, phone)
            WHERE id = ${id}
          `;
        }

        const updated = await sql`
          SELECT id, phone, company_name, name, created_at FROM users WHERE id = ${id}
        `;

        return res.status(200).json({ success: true, user: updated[0] });
      }

      return res.status(400).json({ error: '수정할 정보를 입력해주세요.' });
    } catch (error) {
      console.error('PATCH user error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE - 회원 삭제
  if (req.method === 'DELETE') {
    try {
      // 먼저 해당 회원의 신청 내역에서 user_id 연결 해제
      await sql`
        UPDATE applications SET user_id = NULL WHERE user_id = ${id}
      `;

      // 회원 삭제
      await sql`
        DELETE FROM users WHERE id = ${id}
      `;

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('DELETE user error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
