import { motion } from 'framer-motion';
import { ArrowRight, Award } from 'lucide-react';

const Hero = ({ openModal }) => {
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
              color: '#005FCC'
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
            <span className="block sm:hidden">철거는 끝이 아니라,<br /><span style={{ color: '#005FCC' }}>새로운 공간을 위한</span><br />시작입니다.</span>
            <span className="hidden sm:block">철거는 끝이 아니라,<br /><span style={{ color: '#005FCC' }}>새로운 공간을 위한</span><br />시작입니다.</span>
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
            <span className="block sm:hidden">프리미엄 철거로<br />깨끗한 시작을 만들다</span>
            <span className="hidden sm:block">프리미엄 철거로 깨끗한 시작을 만들다</span>
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
              onClick={() => openModal("무료 견적받기")}
              className="px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold rounded-lg 
                        transition-all duration-200 flex items-center justify-center gap-2
                        hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundColor: '#005FCC',
                color: '#FFFFFF',
                minHeight: '44px'
              }}
            >
              무료 견적받기
              <ArrowRight size={16} />
            </button>
            
            {/* Secondary Button */}
            <button
              onClick={() => scrollToSection('#why-how')}
              className="px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold rounded-lg 
                        transition-all duration-200 flex items-center justify-center gap-2
                        border-2 hover:bg-gray-50"
              style={{
                backgroundColor: 'transparent',
                color: '#005FCC',
                borderColor: '#005FCC',
                minHeight: '44px'
              }}
            >
              자세히 보기
              <ArrowRight size={14} />
            </button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;