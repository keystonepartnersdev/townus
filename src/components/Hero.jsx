import { motion } from 'framer-motion';
import { ArrowRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="min-h-[600px] md:min-h-[700px] lg:min-h-[800px]
                 pt-20 md:pt-24 lg:pt-28
                 pb-20 md:pb-24 lg:pb-28

                 flex items-center justify-center"
      style={{
        background: `
          radial-gradient(ellipse 100% 100% at 50% 10%, rgba(0, 95, 204, 0.25) 0%, transparent 50%),
          linear-gradient(135deg, #ffffff 0%, #f1f7ff 100%)
        `
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full flex flex-col justify-center items-center text-center space-y-6 md:space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '20px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#1456FF'
            }}>
              <Award size={16} />
              대기업 공식 협력사
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight text-center"
            style={{
              letterSpacing: '-1px',
              maxWidth: '800px'
            }}
          >
            <span className="block sm:hidden">철거는 끝이 아니라,<br /><span style={{ color: '#1456FF' }}>새로운 공간을 위한</span><br />시작입니다.</span>
            <span className="hidden sm:block">철거는 끝이 아니라,<br /><span style={{ color: '#1456FF' }}>새로운 공간을 위한</span><br />시작입니다.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-center text-gray-600"
            style={{
              lineHeight: '1.6',
              maxWidth: '600px'
            }}
          >
            <span className="block sm:hidden">철거부터 설비까지,<br />국내 유일 일괄 시공</span>
            <span className="hidden sm:block">철거부터 설비까지, 국내 유일 일괄 시공</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* Primary Button */}
            <button
              onClick={() => navigate('/apply')}
              className="text-sm md:text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#1456FF',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '3px',
                border: 'none',
                minHeight: '44px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.13em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0D47D9';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 95, 204, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1456FF';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              무료 견적받기
              <ArrowRight size={16} />
            </button>

            {/* Secondary Button */}
            <button
              onClick={() => scrollToSection('#why-how')}
              className="text-sm md:text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'transparent',
                color: '#1456FF',
                padding: '10px 22px',
                borderRadius: '3px',
                border: '2px solid #1456FF',
                minHeight: '44px',
                cursor: 'pointer',
                boxSizing: 'border-box',
                textTransform: 'uppercase',
                letterSpacing: '0.13em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F7FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              자세히 보기
              <ArrowRight size={16} />
            </button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
