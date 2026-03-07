import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  // 랜딩 페이지인지 확인
  const isLandingPage = location.pathname === '/';

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      color: '#1f2937',
      padding: '0',
      zIndex: 50,
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'visible',
      willChange: 'transform',
      transform: 'translate3d(0, 0, 0)',
      isolation: 'isolate'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0 auto',
        padding: '0 20px',
        position: 'relative',
        transform: 'translateZ(0)'
      }}>
        {/* 로고 */}
        <div
          onClick={() => navigate(isAuthenticated ? '/mypage' : '/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: '0 0 auto',
            cursor: 'pointer'
          }}>
          <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="4,4 4,56 52,56" fill="#1456FF" />
            <polygon points="8,4 56,4 56,52" fill="#3B7DFF" />
            <line x1="4" y1="4" x2="56" y2="56" stroke="#FFFFFF" strokeWidth="3.5" />
          </svg>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.4rem',
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: '#04091A',
            lineHeight: 1
          }}>TOWNUS</span>
        </div>

        {/* Desktop Menu */}
        <div className="nav-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'flex-end', flex: '1' }}>

          {/* 비로그인: 랜딩 페이지 메뉴 + 로그인 버튼 */}
          {!isAuthenticated && (
            <>
              {isLandingPage && (
                <>
                  <a href="#why-how" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '15px', fontWeight: '500', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.target.style.color = '#1456FF'}
                    onMouseLeave={(e) => e.target.style.color = '#6b7280'}>소개</a>
                  <a href="#what" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '15px', fontWeight: '500', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.target.style.color = '#1456FF'}
                    onMouseLeave={(e) => e.target.style.color = '#6b7280'}>서비스</a>
                  <a href="#process" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '15px', fontWeight: '500', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.target.style.color = '#1456FF'}
                    onMouseLeave={(e) => e.target.style.color = '#6b7280'}>프로세스</a>
                  <a href="#testimonials" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '15px', fontWeight: '500', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.target.style.color = '#1456FF'}
                    onMouseLeave={(e) => e.target.style.color = '#6b7280'}>리뷰</a>
                </>
              )}
              <button
                onClick={() => navigate('/login')}
                style={{
                  backgroundColor: '#1456FF',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minHeight: '40px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0D47D9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#1456FF';
                }}
              >
                로그인 / 회원가입
              </button>
            </>
          )}

          {/* 로그인 상태: 사용자 이름 + 로그아웃 */}
          {isAuthenticated && (
            <div ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '15px', color: '#1a1a2e', fontWeight: '500' }}>
                {user?.name || '회원'}님
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.borderColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#fecaca';
                }}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>

        {/* Mobile CTA */}
        <div className="mobile-cta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isAuthenticated ? (
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: '#1456FF',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '36px'
              }}
            >
              로그인
            </button>
          ) : (
            <>
              <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '500' }}>
                {user?.name || '회원'}님
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
