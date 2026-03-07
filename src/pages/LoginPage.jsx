import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/mypage';

  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(phone, password);
      navigate(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = phone.length >= 13 && password.length >= 4;

  return (
    <div className="auth-page">
      <div className="auth-header">
        <button className="auth-back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="auth-header-title">로그인</span>
      </div>

      <motion.div
        className="auth-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-title-section">
          <h1 className="auth-title">안녕하세요!<br/>로그인해주세요</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}

          <div className="auth-field">
            <label className="auth-label">전화번호</label>
            <input
              type="tel"
              className="auth-input"
              placeholder="010-0000-0000"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={13}
              autoComplete="tel"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">비밀번호</label>
            <input
              type="password"
              className="auth-input"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </form>
      </motion.div>

      <div className="auth-bottom">
        <button
          type="button"
          className={`auth-submit-btn ${isFormValid ? 'active' : ''}`}
          disabled={!isFormValid || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <span className="auth-loading">
              <span className="auth-spinner"></span>
              로그인 중...
            </span>
          ) : (
            '로그인'
          )}
        </button>

        <div className="auth-footer">
          <p>아직 회원이 아니신가요?</p>
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="auth-link">
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
