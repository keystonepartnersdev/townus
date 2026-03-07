import { useState, useEffect } from 'react';

const StaffManagement = ({ authToken, onLogout }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ phone: '', password: '', name: '' });
  const [submitting, setSubmitting] = useState(false);

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
        fetchStaff();
      } else {
        const data = await res.json();
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
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
              placeholder="전화번호"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                <tr key={s.id}>
                  <td>{formatDate(s.created_at)}</td>
                  <td>{s.name}</td>
                  <td>{s.phone}</td>
                  <td>
                    <button
                      className="delete-btn-small"
                      onClick={() => handleDelete(s)}
                    >
                      삭제
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
