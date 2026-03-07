import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'townus-secret-key-change-in-production';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: '전화번호와 비밀번호를 입력해주세요.' });
    }

    const sql = getDb();

    // 전화번호 정규화 (하이픈 유무 상관없이 로그인 가능)
    const normalizedPhone = normalizePhone(phone);

    // 사용자 조회 (정규화된 번호로)
    const users = await sql`
      SELECT id, phone, password_hash, company_name, name
      FROM users
      WHERE phone = ${normalizedPhone}
    `;

    if (users.length === 0) {
      return res.status(401).json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = users[0];

    // 비밀번호 확인
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      {
        userId: user.id,
        phone: user.phone,
        type: 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        companyName: user.company_name,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
}
