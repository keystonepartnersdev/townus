import { useNavigate } from 'react-router-dom';

export default function Navigation() {
  const navigate = useNavigate();

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
      overflow: 'hidden',
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
        <div
          onClick={() => navigate('/')}
          style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: '0 0 auto',
          cursor: 'pointer'
        }}>
          {/* Townus Brand Symbol - 철거(위) + 설비(아래) 대각 분리 */}
          <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 아래-왼쪽 삼각형 (설비 - 견고한 기반) */}
            <polygon points="4,4 4,56 52,56" fill="#1456FF" />
            {/* 위-오른쪽 삼각형 (철거 - 해체 구조체) */}
            <polygon points="8,4 56,4 56,52" fill="#3B7DFF" />
            {/* 정밀 절단선 */}
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
        <div className="nav-menu" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', justifyContent: 'flex-end', flex: '1' }}>
        <a href="#why-how" style={{
          color: '#6b7280',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.color = '#1456FF'}
        onMouseLeave={(e) => e.target.style.color = '#6b7280'}
        >소개</a>
        <a href="#what" style={{
          color: '#6b7280',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.color = '#1456FF'}
        onMouseLeave={(e) => e.target.style.color = '#6b7280'}
        >서비스</a>
        <a href="#process" style={{
          color: '#6b7280',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.color = '#1456FF'}
        onMouseLeave={(e) => e.target.style.color = '#6b7280'}
        >프로세스</a>
        <a href="#testimonials" style={{
          color: '#6b7280',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.color = '#1456FF'}
        onMouseLeave={(e) => e.target.style.color = '#6b7280'}
        >리뷰</a>
        <button
          onClick={() => navigate('/apply')}
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
            letterSpacing: '0.13em'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#0D47D9';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 95, 204, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#1456FF';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          서비스 신청
        </button>
        </div>

        {/* 모바일 전용 버튼 */}
        <div className="mobile-cta" style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigate('/apply')}
            style={{
              backgroundColor: '#1456FF',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: '36px',
              textTransform: 'uppercase',
              letterSpacing: '0.13em'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0D47D9';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1456FF';
            }}
          >
            서비스 신청
          </button>
        </div>
      </div>
    </nav>
  );
}
