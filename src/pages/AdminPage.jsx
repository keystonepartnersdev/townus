import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLogin from '../components/admin/AdminLogin.jsx';
import StaffManagement from '../components/admin/StaffManagement.jsx';

// Auth helper functions
const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem('townus_admin_auth');
    if (!stored) return null;

    const auth = JSON.parse(stored);
    if (new Date(auth.expiresAt) < new Date()) {
      localStorage.removeItem('townus_admin_auth');
      return null;
    }
    return auth;
  } catch {
    return null;
  }
};

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'received', label: '접수완료' },
  { value: 'quoting', label: '견적중' },
  { value: 'working', label: '시공중' },
  { value: 'settling', label: '정산중' },
  { value: 'settled', label: '정산완료' },
];

const STATUS_COLORS = {
  received: { bg: '#dbeafe', color: '#1d4ed8' },
  quoting: { bg: '#fef3c7', color: '#d97706' },
  working: { bg: '#e9d5ff', color: '#7c3aed' },
  settling: { bg: '#fce7f3', color: '#db2777' },
  settled: { bg: '#d1fae5', color: '#059669' },
};

const MENU_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: '📊' },
  { id: 'members', label: '회원관리', icon: '👥', superAdminOnly: true },
  { id: 'applications', label: '신청관리', icon: '📋' },
  { id: 'staff', label: '직원관리', icon: '👔', superAdminOnly: true },
  { id: 'quotes', label: '견적관리', icon: '💰', superAdminOnly: true },
  { id: 'settlements', label: '정산관리', icon: '🧾', superAdminOnly: true },
];

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPreparing, setShowPreparing] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [membersTotal, setMembersTotal] = useState(0);
  const [membersPage, setMembersPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 20;

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setIsAuthenticated(true);
      setAuthData(stored);
    }
    setAuthChecked(true);
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/applications?${params}`, {
        headers: {
          'Authorization': `Bearer ${authData?.token}`,
        },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('데이터를 불러올 수 없습니다.');
      const data = await res.json();
      setApplications(data.applications || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: membersPage.toString(),
        limit: limit.toString(),
        search: searchQuery,
      });
      const res = await fetch(`/api/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${authData?.token}`,
        },
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('데이터를 불러올 수 없습니다.');
      const data = await res.json();
      setMembers(data.users || []);
      setMembersTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeMenu === 'applications') {
      fetchApplications();
    }
    if (isAuthenticated && activeMenu === 'members') {
      fetchMembers();
    }
  }, [isAuthenticated, activeMenu, statusFilter, page, membersPage, searchQuery]);

  const handleLogin = (auth) => {
    setIsAuthenticated(true);
    setAuthData(auth);
  };

  const handleLogout = () => {
    localStorage.removeItem('townus_admin_auth');
    setIsAuthenticated(false);
    setAuthData(null);
  };

  const handleMenuClick = (menuId) => {
    if (menuId === 'dashboard' || menuId === 'applications' || menuId === 'members' || menuId === 'staff') {
      setActiveMenu(menuId);
      setSelectedApp(null);
      setSelectedMember(null);
    } else {
      setShowPreparing(true);
    }
  };

  const isSuperAdmin = authData?.role === 'super_admin';

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Failed to update');
      fetchApplications();
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      const statusLabel = STATUS_OPTIONS.find(s => s.value === newStatus)?.label || newStatus;
      alert(`상태가 "${statusLabel}"(으)로 변경되었습니다.`);
    } catch (err) {
      alert('상태 업데이트 실패: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(total / limit);

  if (!authChecked) {
    return (
      <div className="admin-page">
        <div className="admin-loading">인증 확인 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">TownUs</span>
          <span className="logo-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.filter(item => !item.superAdminOnly || isSuperAdmin).map((item) => (
            <button
              key={item.id}
              className={`sidebar-menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{isSuperAdmin ? 'S' : 'A'}</div>
            <div className="user-details">
              <span className="user-name">{authData?.name || '관리자'}</span>
              <span className="user-email">{authData?.email}</span>
              <span className="user-role">{isSuperAdmin ? '슈퍼관리자' : '직원'}</span>
            </div>
          </div>
          <button className="logout-btn-sidebar" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {activeMenu === 'dashboard' && (
          <DashboardView total={total} membersTotal={membersTotal} onNavigate={setActiveMenu} />
        )}

        {activeMenu === 'members' && !selectedMember && (
          <MembersListView
            members={members}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            page={membersPage}
            setPage={setMembersPage}
            totalPages={Math.ceil(membersTotal / limit)}
            total={membersTotal}
            formatDate={formatDate}
            onSelect={setSelectedMember}
            authToken={authData?.token}
            onRefresh={fetchMembers}
            isSuperAdmin={isSuperAdmin}
            onLogout={handleLogout}
          />
        )}

        {activeMenu === 'members' && selectedMember && (
          <MemberDetailView
            member={selectedMember}
            formatDateTime={formatDateTime}
            onBack={() => setSelectedMember(null)}
            authToken={authData?.token}
            onRefresh={fetchMembers}
            onLogout={handleLogout}
            isSuperAdmin={isSuperAdmin}
          />
        )}

        {activeMenu === 'applications' && !selectedApp && (
          <ApplicationListView
            applications={applications}
            loading={loading}
            error={error}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            total={total}
            formatDate={formatDate}
            onSelect={setSelectedApp}
          />
        )}

        {activeMenu === 'applications' && selectedApp && (
          <ApplicationDetailView
            app={selectedApp}
            formatDateTime={formatDateTime}
            updateStatus={updateStatus}
            onBack={() => setSelectedApp(null)}
            isSuperAdmin={isSuperAdmin}
            authToken={authData?.token}
            onRefresh={fetchApplications}
            onLogout={handleLogout}
          />
        )}

        {activeMenu === 'staff' && isSuperAdmin && (
          <StaffManagement
            authToken={authData?.token}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Preparing Modal */}
      <AnimatePresence>
        {showPreparing && (
          <motion.div
            className="preparing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreparing(false)}
          >
            <motion.div
              className="preparing-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="preparing-icon">🚧</div>
              <h3>준비중입니다</h3>
              <p>해당 기능은 현재 개발 중입니다.</p>
              <button onClick={() => setShowPreparing(false)}>확인</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dashboard View Component
const DashboardView = ({ total, membersTotal, onNavigate }) => {
  const stats = [
    { label: '총 신청', value: total || 0, icon: '📋', color: '#1456FF' },
    { label: '총 회원', value: membersTotal || 0, icon: '👥', color: '#059669' },
    { label: '진행중', value: '-', icon: '⏳', color: '#d97706' },
    { label: '완료', value: '-', icon: '✅', color: '#7c3aed' },
  ];

  return (
    <div className="dashboard-view">
      <header className="content-header">
        <h1>대시보드</h1>
        <p>TownUs 관리자 대시보드에 오신 것을 환영합니다.</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>빠른 메뉴</h2>
        <div className="action-cards">
          <button className="action-card" onClick={() => onNavigate('applications')}>
            <span className="action-icon">📋</span>
            <span className="action-label">신청 관리</span>
            <span className="action-desc">접수된 신청 확인</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Application List View Component
const ApplicationListView = ({
  applications,
  loading,
  error,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  totalPages,
  total,
  formatDate,
  onSelect,
}) => {
  return (
    <div className="list-view">
      <header className="content-header">
        <h1>신청 관리</h1>
        <p>총 {total}건의 신청</p>
      </header>

      <div className="filter-bar">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`filter-chip ${statusFilter === opt.value ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter(opt.value);
              setPage(1);
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="table-container">
        {loading ? (
          <div className="table-loading">로딩중...</div>
        ) : error ? (
          <div className="table-error">
            <p>{error}</p>
            <p className="error-hint">Vercel에 배포 후 사용해주세요.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="table-empty">신청 내역이 없습니다.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>접수일</th>
                <th>회사명</th>
                <th>담당자</th>
                <th>연락처</th>
                <th>배정직원</th>
                <th>상태</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} onClick={() => onSelect(app)}>
                  <td>{formatDate(app.created_at)}</td>
                  <td className="company-name">{app.company_name}</td>
                  <td>{app.manager_name}</td>
                  <td>{app.phone_number}</td>
                  <td className="assigned-staff">{app.assigned_staff_name || '-'}</td>
                  <td>
                    <span
                      className="status-tag"
                      style={{
                        background: STATUS_COLORS[app.status]?.bg || '#f3f4f6',
                        color: STATUS_COLORS[app.status]?.color || '#6b7280',
                      }}
                    >
                      {STATUS_OPTIONS.find((s) => s.value === app.status)?.label || app.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-detail-btn">상세보기</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            이전
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            다음
          </button>
        </div>
      )}
    </div>
  );
};

// Application Detail View Component
const ApplicationDetailView = ({ app, formatDateTime, updateStatus, onBack, isSuperAdmin, authToken, onRefresh, onLogout }) => {
  const [staffList, setStaffList] = useState([]);
  const [assignedTo, setAssignedTo] = useState(app.assigned_to || '');

  useEffect(() => {
    if (isSuperAdmin) {
      const fetchStaff = async () => {
        try {
          const res = await fetch('/api/staff', {
            headers: { 'Authorization': `Bearer ${authToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setStaffList(data.staff || []);
          }
        } catch (err) {
          console.error('Failed to fetch staff:', err);
        }
      };
      fetchStaff();
    }
  }, [isSuperAdmin, authToken]);

  const handleAssign = async (staffId) => {
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ assigned_to: staffId || null }),
      });
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      if (res.ok) {
        setAssignedTo(staffId);
        onRefresh();
        alert('담당자 배정이 완료되었습니다.');
      }
    } catch (err) {
      alert('담당자 배정에 실패했습니다.');
    }
  };
  const sections = [
    {
      title: '기본 정보',
      items: [
        { label: '회사명', value: app.company_name },
        { label: '담당자', value: app.manager_name },
        { label: '연락처', value: app.phone_number },
        { label: '현장주소', value: app.site_address },
        { label: '희망일', value: app.desired_date || '-' },
        { label: '거주여부', value: app.residence_status || '-' },
        { label: '중복공정', value: app.has_other_team || '-' },
      ],
    },
    {
      title: '회원 정보',
      show: !!app.user_id,
      items: [
        { label: '회원 ID', value: app.user_id ? `#${app.user_id}` : '-' },
        { label: '회원 전화번호', value: app.user_phone || '-' },
        { label: '회원 회사명', value: app.user_company || '-' },
        { label: '회원 이름', value: app.user_name || '-' },
      ],
    },
    {
      title: '화장실 철거',
      show: app.bathroom_needed === '필요',
      items: [
        { label: '필요여부', value: app.bathroom_needed },
        { label: '개수', value: app.bathroom_count || '-' },
        { label: '철거항목', value: app.bathroom_items || '-' },
        { label: '기타', value: app.bathroom_other || '-' },
        { label: '추가항목', value: app.bathroom_additional || '-' },
        { label: '추가기타', value: app.bathroom_additional_other || '-' },
      ],
    },
    {
      title: '주방 철거',
      show: app.kitchen_needed === '필요',
      items: [
        { label: '필요여부', value: app.kitchen_needed },
        { label: '타입', value: app.kitchen_type || '-' },
        { label: '사이즈', value: app.kitchen_size || '-' },
        { label: '옵션', value: app.kitchen_options || '-' },
        { label: '기타', value: app.kitchen_other || '-' },
      ],
    },
    {
      title: '바닥 철거',
      show: app.floor_needed === '필요',
      items: [
        { label: '필요여부', value: app.floor_needed },
        { label: '바닥종류', value: app.floor_types || '-' },
        { label: '추가항목', value: app.floor_additional || '-' },
        { label: '기타', value: app.floor_other || '-' },
      ],
    },
    {
      title: '가구 철거',
      show: app.furniture_needed === '필요',
      items: [
        { label: '필요여부', value: app.furniture_needed },
        { label: '가구종류', value: app.furniture_types || '-' },
        { label: '기타', value: app.furniture_other || '-' },
      ],
    },
    {
      title: '목공 철거',
      show: app.woodwork_needed === '필요',
      items: [
        { label: '필요여부', value: app.woodwork_needed },
        { label: '항목', value: app.woodwork_types || '-' },
        { label: '몰딩 평수', value: app.woodwork_molding_area || '-' },
        { label: '걸레받이 평수', value: app.woodwork_baseboard_area || '-' },
        { label: '도어 타입', value: app.woodwork_door_types || '-' },
        { label: '도어 개수', value: app.woodwork_door_count || '-' },
        { label: '중문 개수', value: app.woodwork_inner_door_count || '-' },
        { label: '천장 타입', value: app.woodwork_ceiling_types || '-' },
        { label: '기타', value: app.woodwork_other || '-' },
      ],
    },
    {
      title: '추가 요청사항',
      show: !!app.additional_request,
      items: [{ label: '내용', value: app.additional_request || '-', full: true }],
    },
  ];

  return (
    <div className="detail-view">
      <header className="content-header">
        <button className="back-btn" onClick={onBack}>
          ← 목록으로
        </button>
        <div className="header-info">
          <h1>신청 상세 #{app.id}</h1>
          <p>접수일: {formatDateTime(app.created_at)}</p>
        </div>
      </header>

      <div className="detail-content">
        {sections.map(
          (section, idx) =>
            (section.show === undefined || section.show) && (
              <div key={idx} className="detail-section">
                <h3>{section.title}</h3>
                <div className="detail-items">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className={`detail-item ${item.full ? 'full' : ''}`}>
                      <span className="item-label">{item.label}</span>
                      <span className="item-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        {isSuperAdmin && (
          <div className="detail-section">
            <h3>담당자 배정</h3>
            <div className="assign-staff">
              <select
                value={assignedTo}
                onChange={(e) => handleAssign(e.target.value)}
                className="staff-select"
              >
                <option value="">미배정</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {app.assigned_staff_name && (
                <span className="current-staff">현재: {app.assigned_staff_name}</span>
              )}
            </div>
          </div>
        )}

        <div className="detail-section status-section">
          <h3>상태 변경</h3>
          <div className="status-buttons">
            {STATUS_OPTIONS.filter((s) => s.value !== 'all').map((opt) => (
              <button
                key={opt.value}
                className={`status-change-btn ${app.status === opt.value ? 'active' : ''}`}
                style={
                  app.status === opt.value
                    ? {
                        background: STATUS_COLORS[opt.value]?.bg,
                        color: STATUS_COLORS[opt.value]?.color,
                        borderColor: STATUS_COLORS[opt.value]?.color,
                      }
                    : {}
                }
                onClick={() => updateStatus(app.id, opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Members List View Component
// 전화번호 포맷팅 함수 (하이픈 자동 추가)
const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

const MembersListView = ({
  members,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  page,
  setPage,
  totalPages,
  total,
  formatDate,
  onSelect,
  authToken,
  onRefresh,
  isSuperAdmin,
  onLogout,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ phone: '', password: '', name: '', companyName: '' });
  const [submitting, setSubmitting] = useState(false);

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setPage(1);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password || !formData.name || !formData.companyName) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '회원 추가에 실패했습니다.');
      }

      alert('회원이 추가되었습니다.');
      setFormData({ phone: '', password: '', name: '', companyName: '' });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="list-view">
      <header className="content-header">
        <div className="header-row">
          <div>
            <h1>회원 관리</h1>
            <p>총 {total}명의 회원</p>
          </div>
          {isSuperAdmin && (
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? '취소' : '+ 회원 추가'}
            </button>
          )}
        </div>
      </header>

      {showForm && isSuperAdmin && (
        <form className="staff-form" onSubmit={handleAddMember}>
          <div className="form-row">
            <input
              type="text"
              placeholder="회사명"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="form-input"
            />
            <input
              type="text"
              placeholder="이름"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
            <input
              type="tel"
              placeholder="전화번호 (010-0000-0000)"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={13}
              className="form-input"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
            />
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? '추가중...' : '추가'}
            </button>
          </div>
        </form>
      )}

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="전화번호, 회사명, 이름으로 검색..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">검색</button>
      </form>

      <div className="table-container">
        {loading ? (
          <div className="table-loading">로딩중...</div>
        ) : error ? (
          <div className="table-error">
            <p>{error}</p>
          </div>
        ) : members.length === 0 ? (
          <div className="table-empty">회원이 없습니다.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>가입일</th>
                <th>회사명</th>
                <th>이름</th>
                <th>연락처</th>
                <th>신청 수</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} onClick={() => onSelect(member)}>
                  <td>{formatDate(member.created_at)}</td>
                  <td className="company-name">{member.company_name}</td>
                  <td>{member.name}</td>
                  <td>{member.phone}</td>
                  <td>{member.application_count || 0}건</td>
                  <td>
                    <button className="view-detail-btn">상세보기</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            이전
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            다음
          </button>
        </div>
      )}
    </div>
  );
};

// Member Detail View Component
const MemberDetailView = ({ member, formatDateTime, onBack, authToken, onRefresh, onLogout, isSuperAdmin }) => {
  const [memberDetail, setMemberDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appPage, setAppPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ companyName: '', name: '', phone: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDetail = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${member.id}?page=${page}&limit=5`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setMemberDetail(data);
        // 수정 폼 초기화
        if (!isEditing) {
          setEditForm({
            companyName: data.user.company_name || '',
            name: data.user.name || '',
            phone: data.user.phone || '',
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch member detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail(appPage);
  }, [member.id, authToken, appPage]);

  const handleDelete = async () => {
    if (!confirm(`정말 "${member.name}" 회원을 삭제하시겠습니까?\n신청 내역은 유지되지만 회원 연결은 해제됩니다.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/users/${member.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (res.ok) {
        alert('회원이 삭제되었습니다.');
        onRefresh();
        onBack();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 회원 정보 수정
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${member.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert('회원 정보가 수정되었습니다.');
        setIsEditing(false);
        fetchDetail(appPage);
        onRefresh();
      } else {
        alert(data.error || '수정에 실패했습니다.');
      }
    } catch (err) {
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 비밀번호 재설정
  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 4) {
      alert('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${member.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('비밀번호가 재설정되었습니다.');
        setShowPasswordModal(false);
        setNewPassword('');
      } else {
        alert(data.error || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (err) {
      alert('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 전화번호 포맷팅
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setEditForm({ ...editForm, phone: formatted });
  };

  if (loading) {
    return (
      <div className="detail-view">
        <header className="content-header">
          <button className="back-btn" onClick={onBack}>← 목록으로</button>
        </header>
        <div className="table-loading">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="detail-view">
      <header className="content-header">
        <button className="back-btn" onClick={onBack}>← 목록으로</button>
        <div className="header-info">
          <h1>회원 상세 #{member.id}</h1>
          <p>가입일: {formatDateTime(member.created_at)}</p>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-section">
          <div className="section-header">
            <h3>기본 정보</h3>
            {isSuperAdmin && !isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>수정</button>
            )}
          </div>
          {isEditing && isSuperAdmin ? (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="detail-items">
                <div className="detail-item">
                  <span className="item-label">회사명</span>
                  <input
                    type="text"
                    value={editForm.companyName}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                    className="edit-input"
                  />
                </div>
                <div className="detail-item">
                  <span className="item-label">이름</span>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="edit-input"
                  />
                </div>
                <div className="detail-item">
                  <span className="item-label">연락처</span>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    className="edit-input"
                  />
                </div>
              </div>
              <div className="edit-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>취소</button>
                <button type="submit" className="save-btn" disabled={submitting}>
                  {submitting ? '저장중...' : '저장'}
                </button>
              </div>
            </form>
          ) : (
            <div className="detail-items">
              <div className="detail-item">
                <span className="item-label">회사명</span>
                <span className="item-value">{memberDetail?.user?.company_name || member.company_name}</span>
              </div>
              <div className="detail-item">
                <span className="item-label">이름</span>
                <span className="item-value">{memberDetail?.user?.name || member.name}</span>
              </div>
              <div className="detail-item">
                <span className="item-label">연락처</span>
                <span className="item-value">{memberDetail?.user?.phone || member.phone}</span>
              </div>
            </div>
          )}
        </div>

        {isSuperAdmin && (
          <div className="detail-section">
            <h3>비밀번호 관리</h3>
            <button className="password-reset-btn" onClick={() => setShowPasswordModal(true)}>
              비밀번호 재설정
            </button>
          </div>
        )}

        <div className="detail-section">
          <h3>신청 내역 ({memberDetail?.pagination?.total || 0}건)</h3>
          {memberDetail?.applications?.length > 0 ? (
            <>
              <div className="member-applications-list">
                {memberDetail.applications.map((app) => (
                  <div key={app.id} className="member-app-item">
                    <div className="app-info">
                      <span className="app-id">#{app.id}</span>
                      <span className="app-address">{app.site_address}</span>
                    </div>
                    <div className="app-meta">
                      <span
                        className="status-tag"
                        style={{
                          background: STATUS_COLORS[app.status]?.bg || '#f3f4f6',
                          color: STATUS_COLORS[app.status]?.color || '#6b7280',
                        }}
                      >
                        {STATUS_OPTIONS.find((s) => s.value === app.status)?.label || app.status}
                      </span>
                      <span className="app-date">{formatDateTime(app.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {memberDetail?.pagination?.totalPages > 1 && (
                <div className="pagination" style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => setAppPage(p => Math.max(1, p - 1))}
                    disabled={appPage === 1}
                    className="page-btn"
                  >
                    이전
                  </button>
                  <span className="page-info">
                    {appPage} / {memberDetail.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setAppPage(p => Math.min(memberDetail.pagination.totalPages, p + 1))}
                    disabled={appPage >= memberDetail.pagination.totalPages}
                    className="page-btn"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>신청 내역이 없습니다.</p>
          )}
        </div>

        <div className="detail-section danger-section">
          <h3>회원 관리</h3>
          <button className="delete-btn" onClick={handleDelete}>
            회원 삭제
          </button>
        </div>
      </div>

      {/* 비밀번호 재설정 모달 */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>비밀번호 재설정</h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              {memberDetail?.user?.name || member.name}님의 새 비밀번호를 입력하세요.
            </p>
            <input
              type="password"
              placeholder="새 비밀번호 (4자 이상)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="modal-input"
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => { setShowPasswordModal(false); setNewPassword(''); }}>
                취소
              </button>
              <button className="save-btn" onClick={handlePasswordReset} disabled={submitting}>
                {submitting ? '처리중...' : '재설정'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
