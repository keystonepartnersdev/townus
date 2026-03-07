import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, password, companyName, name } = req.body;

    // 입력 검증
    if (!phone || !password || !companyName || !name) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    // 전화번호 형식 검증
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
      return res.status(400).json({ error: '올바른 전화번호 형식이 아닙니다.' });
    }

    // 비밀번호 길이 검증
    if (password.length < 4) {
      return res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다.' });
    }

    const sql = getDb();

    // 전화번호 중복 확인
    const existing = await sql`
      SELECT id FROM users WHERE phone = ${phone}
    `;

    if (existing.length > 0) {
      return res.status(409).json({ error: '이미 가입된 전화번호입니다.' });
    }

    // 비밀번호 해시
    const passwordHash = await bcrypt.hash(password, 10);

    // 사용자 생성
    const result = await sql`
      INSERT INTO users (phone, password_hash, company_name, name)
      VALUES (${phone}, ${passwordHash}, ${companyName}, ${name})
      RETURNING id, phone, company_name, name, created_at
    `;

    return res.status(201).json({
      success: true,
      user: {
        id: result[0].id,
        phone: result[0].phone,
        companyName: result[0].company_name,
        name: result[0].name
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
}
