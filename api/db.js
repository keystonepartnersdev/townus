import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export const getDb = () => {
  const sql = neon(process.env.DATABASE_URL);
  return sql;
};

// 테이블 초기화 (최초 1회 실행)
export const initDb = async () => {
  const sql = getDb();

  // users 테이블 생성
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(20) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      company_name VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // admins 테이블 생성
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'staff',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // admins 테이블에 role 컬럼 추가 (기존 테이블용)
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admins' AND column_name = 'role'
      ) THEN
        ALTER TABLE admins ADD COLUMN role VARCHAR(20) DEFAULT 'staff';
      END IF;
    END $$;
  `;

  // applications 테이블에 assigned_to 컬럼 추가
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'applications' AND column_name = 'assigned_to'
      ) THEN
        ALTER TABLE applications ADD COLUMN assigned_to INTEGER REFERENCES admins(id);
      END IF;
    END $$;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      manager_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20) NOT NULL,
      site_address TEXT NOT NULL,
      desired_date VARCHAR(50),
      residence_status VARCHAR(50),
      has_other_team VARCHAR(50),
      bathroom_needed VARCHAR(10),
      bathroom_count VARCHAR(20),
      bathroom_items TEXT,
      bathroom_other TEXT,
      bathroom_additional TEXT,
      bathroom_additional_other TEXT,
      kitchen_needed VARCHAR(10),
      kitchen_type VARCHAR(50),
      kitchen_size VARCHAR(50),
      kitchen_options TEXT,
      kitchen_other TEXT,
      floor_needed VARCHAR(10),
      floor_types TEXT,
      floor_additional TEXT,
      floor_other TEXT,
      furniture_needed VARCHAR(10),
      furniture_types TEXT,
      furniture_other TEXT,
      woodwork_needed VARCHAR(10),
      woodwork_types TEXT,
      woodwork_molding_area VARCHAR(50),
      woodwork_baseboard_area VARCHAR(50),
      woodwork_door_types TEXT,
      woodwork_door_count VARCHAR(20),
      woodwork_inner_door_count VARCHAR(20),
      woodwork_ceiling_types TEXT,
      woodwork_other TEXT,
      additional_request TEXT,
      user_id INTEGER REFERENCES users(id),
      status VARCHAR(20) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // 기존 테이블에 user_id 컬럼 추가 (이미 있으면 무시)
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'applications' AND column_name = 'user_id'
      ) THEN
        ALTER TABLE applications ADD COLUMN user_id INTEGER REFERENCES users(id);
      END IF;
    END $$;
  `;

  // 기본 관리자 계정 생성 (없으면)
  const existingAdmin = await sql`
    SELECT id, role FROM admins WHERE email = 'admin@townus.co.kr'
  `;

  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash('admin1234', 10);
    await sql`
      INSERT INTO admins (email, password_hash, name, role)
      VALUES ('admin@townus.co.kr', ${passwordHash}, '관리자', 'super_admin')
    `;
  } else if (existingAdmin[0].role !== 'super_admin') {
    // 기존 관리자를 super_admin으로 업데이트
    await sql`
      UPDATE admins SET role = 'super_admin' WHERE email = 'admin@townus.co.kr'
    `;
  }

  // applications 상태값 마이그레이션 (기존 상태 -> 새 상태)
  await sql`
    UPDATE applications SET status = 'received' WHERE status = 'new';
  `;
  await sql`
    UPDATE applications SET status = 'quoting' WHERE status = 'reviewing';
  `;
  await sql`
    UPDATE applications SET status = 'working' WHERE status = 'contacted';
  `;
  await sql`
    UPDATE applications SET status = 'settled' WHERE status = 'completed';
  `;

  return { success: true };
};
