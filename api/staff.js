import bcrypt from 'bcryptjs';
import { getDb } from './db.js';
import { requireSuperAdmin } from './_auth.js';

export default async function handler(req, res) {
  // 슈퍼관리자 인증 확인
  const admin = requireSuperAdmin(req, res);
  if (!admin) return;

  const sql = getDb();

  // GET - 직원 목록 조회
  if (req.method === 'GET') {
    try {
      const staff = await sql`
        SELECT id, phone, name, role, created_at
        FROM admins
        WHERE role = 'staff'
        ORDER BY created_at DESC
      `;

      return res.status(200).json({ staff });
    } catch (error) {
      console.error('GET staff error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - 직원 생성
  if (req.method === 'POST') {
    try {
      const { phone, password, name } = req.body;

      if (!phone || !password || !name) {
        return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
      }

      // 전화번호 중복 확인
      const existing = await sql`
        SELECT id FROM admins WHERE phone = ${phone}
      `;

      if (existing.length > 0) {
        return res.status(409).json({ error: '이미 등록된 전화번호입니다.' });
      }

      // 비밀번호 해시
      const passwordHash = await bcrypt.hash(password, 10);

      // 직원 생성
      const result = await sql`
        INSERT INTO admins (phone, password_hash, name, role)
        VALUES (${phone}, ${passwordHash}, ${name}, 'staff')
        RETURNING id, phone, name, role, created_at
      `;

      return res.status(201).json({
        success: true,
        staff: result[0]
      });
    } catch (error) {
      console.error('POST staff error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
