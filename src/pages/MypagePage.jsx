import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import '../styles/auth.css';

const STATUS_OPTIONS = {
  received: '접수완료',
  quoting: '견적중',
  working: '시공중',
  settling: '정산중',
  settled: '정산완료',
};

const STATUS_COLORS = {
  received: { bg: '#dbeafe', color: '#1d4ed8' },
  quoting: { bg: '#fef3c7', color: '#d97706' },
  working: { bg: '#e9d5ff', color: '#7c3aed' },
  settling: { bg: '#fce7f3', color: '#db2777' },
  settled: { bg: '#d1fae5', color: '#059669' },
};

const MypagePage = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoading) return; // AuthContext 초기화 대기

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchMyApplications(token);
  }, [isLoading, isAuthenticated, token, navigate]);

  const fetchMyApplications = async (authToken) => {
    if (!authToken) return;

    try {
      const res = await fetch('/api/my-applications', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error('데이터를 불러올 수 없습니다.');

      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  // 로딩 중
  if (isLoading) {
    return (
      <div className="page-container">
        <Navigation />
        <main className="mypage-main">
          <div className="mypage-container">
            <div className="loading-state">로딩중...</div>
          </div>
        </main>
      </div>
    );
  }

  // 비로그인 상태
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="page-container">
      <Navigation />
      <main className="mypage-main">
        <div className="mypage-container">
          {/* 헤더 + 새 신청 버튼 */}
          <header className="dashboard-header">
            <div className="header-left">
              <h1>{user?.name || '회원'}님의 대시보드</h1>
              <p>{user?.companyName}</p>
            </div>
            <button className="new-apply-btn" onClick={() => navigate('/apply')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              새 서비스 신청
            </button>
          </header>

          {/* 요약 카드 */}
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-value">{applications.length}</span>
              <span className="summary-label">전체 신청</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{applications.filter(a => a.status === 'received' || a.status === 'quoting').length}</span>
              <span className="summary-label">진행 대기</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{applications.filter(a => a.status === 'working' || a.status === 'settling').length}</span>
              <span className="summary-label">진행중</span>
            </div>
            <div className="summary-card">
              <span className="summary-value">{applications.filter(a => a.status === 'settled').length}</span>
              <span className="summary-label">완료</span>
            </div>
          </div>

          {/* 신청 내역 */}
          <section className="applications-section">
            <h2>신청 내역</h2>

            {loading ? (
              <div className="loading-state">로딩중...</div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>아직 신청 내역이 없습니다.</p>
                <p className="empty-hint">새 서비스 신청을 시작해보세요!</p>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map((app) => (
                  <div key={app.id} className="application-card">
                    <div className="card-header">
                      <span className="app-id">#{app.id}</span>
                      <span
                        className="status-badge"
                        style={{
                          background: STATUS_COLORS[app.status]?.bg || '#f3f4f6',
                          color: STATUS_COLORS[app.status]?.color || '#6b7280',
                        }}
                      >
                        {STATUS_OPTIONS[app.status] || app.status}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="card-row">
                        <span className="row-label">현장주소</span>
                        <span className="row-value">{app.site_address}</span>
                      </div>
                      <div className="card-row">
                        <span className="row-label">희망일</span>
                        <span className="row-value">{app.desired_date || '-'}</span>
                      </div>
                      <div className="card-row">
                        <span className="row-label">담당직원</span>
                        <span className="row-value">{app.assigned_staff_name || '배정 대기중'}</span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <span className="app-date">접수일: {formatDate(app.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MypagePage;
