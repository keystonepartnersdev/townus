import { getDb } from './db.js';
import { requireAdmin } from './_auth.js';

export default async function handler(req, res) {
  const sql = getDb();

  // GET - 신청 목록 조회 (관리자 인증 필요)
  if (req.method === 'GET') {
    // 관리자 인증 확인
    const admin = requireAdmin(req, res);
    if (!admin) return; // 인증 실패 시 이미 응답 전송됨

    try {
      const { status, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      let applications;
      let total;

      // 역할 기반 필터링: staff는 자신에게 배정된 것만, super_admin은 전체
      const isStaff = admin.role === 'staff';
      const adminId = admin.adminId;

      if (status && status !== 'all') {
        if (isStaff) {
          applications = await sql`
            SELECT a.*, u.phone as user_phone, u.company_name as user_company, u.name as user_name,
                   adm.name as assigned_staff_name
            FROM applications a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN admins adm ON a.assigned_to = adm.id
            WHERE a.status = ${status} AND a.assigned_to = ${adminId}
            ORDER BY a.created_at DESC
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
          `;
          total = await sql`SELECT COUNT(*) as count FROM applications WHERE status = ${status} AND assigned_to = ${adminId}`;
        } else {
          applications = await sql`
            SELECT a.*, u.phone as user_phone, u.company_name as user_company, u.name as user_name,
                   adm.name as assigned_staff_name
            FROM applications a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN admins adm ON a.assigned_to = adm.id
            WHERE a.status = ${status}
            ORDER BY a.created_at DESC
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
          `;
          total = await sql`SELECT COUNT(*) as count FROM applications WHERE status = ${status}`;
        }
      } else {
        if (isStaff) {
          applications = await sql`
            SELECT a.*, u.phone as user_phone, u.company_name as user_company, u.name as user_name,
                   adm.name as assigned_staff_name
            FROM applications a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN admins adm ON a.assigned_to = adm.id
            WHERE a.assigned_to = ${adminId}
            ORDER BY a.created_at DESC
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
          `;
          total = await sql`SELECT COUNT(*) as count FROM applications WHERE assigned_to = ${adminId}`;
        } else {
          applications = await sql`
            SELECT a.*, u.phone as user_phone, u.company_name as user_company, u.name as user_name,
                   adm.name as assigned_staff_name
            FROM applications a
            LEFT JOIN users u ON a.user_id = u.id
            LEFT JOIN admins adm ON a.assigned_to = adm.id
            ORDER BY a.created_at DESC
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
          `;
          total = await sql`SELECT COUNT(*) as count FROM applications`;
        }
      }

      return res.status(200).json({
        applications,
        total: parseInt(total[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (error) {
      console.error('GET applications error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - 새 신청 저장
  if (req.method === 'POST') {
    try {
      const data = req.body;

      const result = await sql`
        INSERT INTO applications (
          company_name, manager_name, phone_number, site_address,
          desired_date, residence_status, has_other_team,
          bathroom_needed, bathroom_count, bathroom_items, bathroom_other,
          bathroom_additional, bathroom_additional_other,
          kitchen_needed, kitchen_type, kitchen_size, kitchen_options, kitchen_other,
          floor_needed, floor_types, floor_additional, floor_other,
          furniture_needed, furniture_types, furniture_other,
          woodwork_needed, woodwork_types, woodwork_molding_area, woodwork_baseboard_area,
          woodwork_door_types, woodwork_door_count, woodwork_inner_door_count,
          woodwork_ceiling_types, woodwork_other,
          additional_request, user_id
        ) VALUES (
          ${data.companyName}, ${data.managerName}, ${data.phoneNumber}, ${data.siteAddress},
          ${data.desiredDate}, ${data.residenceStatus}, ${data.hasOtherTeam},
          ${data.bathroomNeeded}, ${data.bathroomCount}, ${data.bathroomItems}, ${data.bathroomOther},
          ${data.bathroomAdditional}, ${data.bathroomAdditionalOther},
          ${data.kitchenNeeded}, ${data.kitchenType}, ${data.kitchenSize}, ${data.kitchenOptions}, ${data.kitchenOther},
          ${data.floorNeeded}, ${data.floorTypes}, ${data.floorAdditional}, ${data.floorOther},
          ${data.furnitureNeeded}, ${data.furnitureTypes}, ${data.furnitureOther},
          ${data.woodworkNeeded}, ${data.woodworkTypes}, ${data.woodworkMoldingArea}, ${data.woodworkBaseboardArea},
          ${data.woodworkDoorTypes}, ${data.woodworkDoorCount}, ${data.woodworkInnerDoorCount},
          ${data.woodworkCeilingTypes}, ${data.woodworkOther},
          ${data.additionalRequest}, ${data.userId || null}
        )
        RETURNING id
      `;

      return res.status(201).json({ success: true, id: result[0].id });
    } catch (error) {
      console.error('POST application error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
