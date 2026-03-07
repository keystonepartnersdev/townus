import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'townus-secret-key-change-in-production';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, phone } = req.body;
    const loginId = email || phone;

    if (!loginId || !password) {
      return res.status(400).json({ error: '이메일/전화번호와 비밀번호를 입력해주세요.' });
    }

    const sql = getDb();

    // 관리자 조회 (이메일 또는 전화번호로)
    const admins = await sql`
      SELECT id, email, phone, password_hash, name, role
      FROM admins
      WHERE email = ${loginId} OR phone = ${loginId}
    `;

    if (admins.length === 0) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const admin = admins[0];

    // 비밀번호 확인
    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        type: 'admin',
        role: admin.role || 'staff'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        phone: admin.phone,
        name: admin.name,
        role: admin.role || 'staff'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
}
