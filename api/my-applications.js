import { getDb } from './db.js';
import { requireAuth } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 사용자 인증 확인
  const user = requireAuth(req, res);
  if (!user) return;

  const sql = getDb();

  try {
    const applications = await sql`
      SELECT
        a.id, a.company_name, a.manager_name, a.phone_number,
        a.site_address, a.desired_date, a.status, a.created_at,
        adm.name as assigned_staff_name
      FROM applications a
      LEFT JOIN admins adm ON a.assigned_to = adm.id
      WHERE a.user_id = ${user.userId}
      ORDER BY a.created_at DESC
    `;

    return res.status(200).json({ applications });
  } catch (error) {
    console.error('GET my-applications error:', error);
    return res.status(500).json({ error: error.message });
  }
}
