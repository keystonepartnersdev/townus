import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const STEPS = [
  { id: 'phone', title: '전화번호를 입력해주세요', subtitle: '로그인 시 아이디로 사용됩니다' },
  { id: 'password', title: '비밀번호를 설정해주세요', subtitle: '4자 이상 입력해주세요' },
  { id: 'company', title: '회사명을 입력해주세요', subtitle: '사업자명 또는 상호명' },
  { id: 'name', title: '담당자 성함을 입력해주세요', subtitle: '연락받으실 분의 성함' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/apply';

  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    companyName: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      value = formatPhone(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const isStepValid = () => {
    switch (STEPS[step].id) {
      case 'phone':
        return formData.phone.length >= 13;
      case 'password':
        return formData.password.length >= 4;
      case 'company':
        return formData.companyName.length >= 1;
      case 'name':
        return formData.name.length >= 1;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!isStepValid()) return;

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // 마지막 단계: 회원가입 처리
      setIsLoading(true);
      setError('');

      try {
        await register(formData);
        navigate(redirect);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setError('');
    } else {
      navigate(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isStepValid()) {
      handleNext();
    }
  };

  const currentStep = STEPS[step];

  const renderInput = () => {
    switch (currentStep.id) {
      case 'phone':
        return (
          <input
            type="tel"
            className="auth-input-large"
            placeholder="010-0000-0000"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={13}
            autoFocus
            autoComplete="tel"
          />
        );
      case 'password':
        return (
          <input
            type="password"
            className="auth-input-large"
            placeholder="비밀번호 입력"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="new-password"
          />
        );
      case 'company':
        return (
          <input
            type="text"
            className="auth-input-large"
            placeholder="예) 홍길동인테리어"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="organization"
          />
        );
      case 'name':
        return (
          <input
            type="text"
            className="auth-input-large"
            placeholder="예) 홍길동"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="name"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <button className="auth-back-btn" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="auth-header-title">회원가입</span>
        <span className="auth-step-counter">{step + 1} / {STEPS.length}</span>
      </div>

      <div className="auth-progress">
        <div
          className="auth-progress-bar"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="auth-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="auth-title-section">
            <h1 className="auth-title">{currentStep.title}</h1>
            <p className="auth-subtitle">{currentStep.subtitle}</p>
          </div>

          <div className="auth-form">
            {error && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                {error}
              </motion.div>
            )}

            {renderInput()}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="auth-bottom">
        <button
          className={`auth-submit-btn ${isStepValid() ? 'active' : ''}`}
          onClick={handleNext}
          disabled={!isStepValid() || isLoading}
        >
          {isLoading ? (
            <span className="auth-loading">
              <span className="auth-spinner"></span>
              가입 중...
            </span>
          ) : step === STEPS.length - 1 ? (
            '가입 완료'
          ) : (
            '다음'
          )}
        </button>

        {step === 0 && (
          <div className="auth-footer">
            <p>이미 회원이신가요?</p>
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="auth-link">
              로그인하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
