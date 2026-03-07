import bcrypt from 'bcryptjs';
import { getDb } from './db.js';
import { requireAdmin, requireSuperAdmin } from './_auth.js';

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
  const sql = getDb();

  // POST - 회원 생성 (슈퍼관리자 전용)
  if (req.method === 'POST') {
    const admin = requireSuperAdmin(req, res);
    if (!admin) return;

    try {
      const { phone, password, name, companyName } = req.body;

      if (!phone || !password || !name || !companyName) {
        return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
      }

      // 전화번호 정규화 (하이픈 포함 형식으로 저장)
      const normalizedPhone = normalizePhone(phone);

      // 전화번호 중복 확인 (정규화된 번호로)
      const existing = await sql`
        SELECT id FROM users WHERE phone = ${normalizedPhone}
      `;

      if (existing.length > 0) {
        return res.status(409).json({ error: '이미 등록된 전화번호입니다.' });
      }

      // 비밀번호 해시
      const passwordHash = await bcrypt.hash(password, 10);

      // 회원 생성 (정규화된 전화번호로 저장)
      const result = await sql`
        INSERT INTO users (phone, password_hash, name, company_name)
        VALUES (${normalizedPhone}, ${passwordHash}, ${name}, ${companyName})
        RETURNING id, phone, name, company_name, created_at
      `;

      return res.status(201).json({
        success: true,
        user: result[0]
      });
    } catch (error) {
      console.error('POST user error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // 관리자 인증 확인 (GET 요청용)
  const admin = requireAdmin(req, res);
  if (!admin) return;

  // GET - 회원 목록 조회
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      const offset = (page - 1) * limit;

      let users;
      let total;

      if (search) {
        users = await sql`
          SELECT
            u.id, u.phone, u.company_name, u.name, u.created_at,
            COUNT(a.id) as application_count
          FROM users u
          LEFT JOIN applications a ON u.id = a.user_id
          WHERE u.phone LIKE ${'%' + search + '%'}
             OR u.company_name LIKE ${'%' + search + '%'}
             OR u.name LIKE ${'%' + search + '%'}
          GROUP BY u.id, u.phone, u.company_name, u.name, u.created_at
          ORDER BY u.created_at DESC
          LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
        `;
        total = await sql`
          SELECT COUNT(*) as count FROM users
          WHERE phone LIKE ${'%' + search + '%'}
             OR company_name LIKE ${'%' + search + '%'}
             OR name LIKE ${'%' + search + '%'}
        `;
      } else {
        users = await sql`
          SELECT
            u.id, u.phone, u.company_name, u.name, u.created_at,
            COUNT(a.id) as application_count
          FROM users u
          LEFT JOIN applications a ON u.id = a.user_id
          GROUP BY u.id, u.phone, u.company_name, u.name, u.created_at
          ORDER BY u.created_at DESC
          LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
        `;
        total = await sql`SELECT COUNT(*) as count FROM users`;
      }

      return res.status(200).json({
        users,
        total: parseInt(total[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      console.error('GET users error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
