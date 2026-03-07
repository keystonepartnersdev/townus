import { useState } from 'react';
import { motion } from 'framer-motion';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '로그인에 실패했습니다.');
      }

      // Store token and auth data
      localStorage.setItem('townus_admin_token', data.token);
      const authData = {
        email: data.admin.email,
        name: data.admin.name,
        role: data.admin.role,
        token: data.token,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      localStorage.setItem('townus_admin_auth', JSON.stringify(authData));
      onLogin(authData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <motion.div
        className="admin-login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <span className="logo-text">TownUs</span>
            <span className="logo-badge">Admin</span>
          </div>
          <h1>관리자 로그인</h1>
          <p>신청 관리 시스템에 접속하려면 로그인하세요.</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              className="admin-login-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}

          <div className="admin-login-field">
            <label htmlFor="loginId">이메일 또는 전화번호</label>
            <input
              id="loginId"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 또는 전화번호"
              required
              autoComplete="username"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-loading">
                <span className="spinner"></span>
                로그인 중...
              </span>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>TownUs 철거 서비스 관리 시스템</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
