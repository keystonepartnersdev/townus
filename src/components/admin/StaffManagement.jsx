import { useState, useEffect } from 'react';

// 전화번호 포맷팅 함수
const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

const StaffManagement = ({ authToken, onLogout }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ phone: '', password: '', name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/staff', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      if (!res.ok) throw new Error('직원 목록을 불러올 수 없습니다.');
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handlePhoneInput = (e, setter, field) => {
    const formatted = formatPhoneNumber(e.target.value);
    setter(prev => ({ ...prev, [field]: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password || !formData.name) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/staff', {
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
        throw new Error(data.error || '직원 추가에 실패했습니다.');
      }

      alert('직원이 추가되었습니다.');
      setFormData({ phone: '', password: '', name: '' });
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (staffMember) => {
    if (!confirm(`정말 "${staffMember.name}" 직원을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/staff/${staffMember.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });

      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }

      if (res.ok) {
        alert('직원이 삭제되었습니다.');
        setSelectedStaff(null);
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/staff/${selectedStaff.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert('직원 정보가 수정되었습니다.');
        setIsEditing(false);
        setSelectedStaff({ ...selectedStaff, ...data.staff });
        fetchStaff();
      } else {
        alert(data.error || '수정에 실패했습니다.');
      }
    } catch (err) {
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 4) {
      alert('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/staff/${selectedStaff.id}`, {
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

  const handleSelectStaff = (s) => {
    setSelectedStaff(s);
    setEditForm({ name: s.name || '', phone: s.phone || '' });
    setIsEditing(false);
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

  // 상세보기 화면
  if (selectedStaff) {
    return (
      <div className="detail-view">
        <header className="content-header">
          <button className="back-btn" onClick={() => setSelectedStaff(null)}>← 목록으로</button>
          <div className="header-info">
            <h1>직원 상세 #{selectedStaff.id}</h1>
            <p>등록일: {formatDate(selectedStaff.created_at)}</p>
          </div>
        </header>

        <div className="detail-content">
          <div className="detail-section">
            <div className="section-header">
              <h3>기본 정보</h3>
              {!isEditing && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>수정</button>
              )}
            </div>
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="detail-items">
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
                    <span className="item-label">전화번호</span>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handlePhoneInput(e, setEditForm, 'phone')}
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
                  <span className="item-label">이름</span>
                  <span className="item-value">{selectedStaff.name}</span>
                </div>
                <div className="detail-item">
                  <span className="item-label">전화번호</span>
                  <span className="item-value">{selectedStaff.phone || '-'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>비밀번호 관리</h3>
            <button className="password-reset-btn" onClick={() => setShowPasswordModal(true)}>
              비밀번호 재설정
            </button>
          </div>

          <div className="detail-section danger-section">
            <h3>직원 관리</h3>
            <button className="delete-btn" onClick={() => handleDelete(selectedStaff)}>
              직원 삭제
            </button>
          </div>
        </div>

        {/* 비밀번호 재설정 모달 */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>비밀번호 재설정</h3>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                {selectedStaff.name}님의 새 비밀번호를 입력하세요.
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
  }

  // 목록 화면
  return (
    <div className="list-view">
      <header className="content-header">
        <div className="header-row">
          <div>
            <h1>직원 관리</h1>
            <p>총 {staff.length}명의 직원</p>
          </div>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '취소' : '+ 직원 추가'}
          </button>
        </div>
      </header>

      {showForm && (
        <form className="staff-form" onSubmit={handleSubmit}>
          <div className="form-row">
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
              onChange={(e) => handlePhoneInput(e, setFormData, 'phone')}
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

      <div className="table-container">
        {loading ? (
          <div className="table-loading">로딩중...</div>
        ) : error ? (
          <div className="table-error"><p>{error}</p></div>
        ) : staff.length === 0 ? (
          <div className="table-empty">등록된 직원이 없습니다.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>등록일</th>
                <th>이름</th>
                <th>전화번호</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} onClick={() => handleSelectStaff(s)} style={{ cursor: 'pointer' }}>
                  <td>{formatDate(s.created_at)}</td>
                  <td>{s.name}</td>
                  <td>{s.phone || '-'}</td>
                  <td>
                    <button
                      className="view-detail-btn"
                      onClick={(e) => { e.stopPropagation(); handleSelectStaff(s); }}
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
