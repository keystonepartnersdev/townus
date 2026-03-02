import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Promo = () => {
  const navigate = useNavigate();

  return (
    <section
      id="promo"
      className="section"
      style={{
        background: `
          radial-gradient(ellipse 100% 100% at 50% 10%, rgba(0, 95, 204, 0.25) 0%, transparent 50%),
          linear-gradient(135deg, #ffffff 0%, #f1f7ff 100%)
        `
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">

        {/* 이벤트 프로모션 */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            transition: { duration: 0.3 }
          }}
          className="max-w-xl mx-auto rounded-2xl p-8 shadow-lg transition-all duration-300 text-center border border-gray-200"
          style={{
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* 이벤트 배지 */}
          <div className="inline-flex items-center px-4 py-2 rounded-full mb-6" style={{ background: '#1456FF' }}>
            <span className="text-white font-semibold text-sm">서비스 10주년 기념</span>
          </div>


          {/* 할인 강조 */}
          <div className="mb-8">
            <div className="text-5xl font-black mb-3" style={{ color: '#1456FF' }}>
              5%
            </div>
            <div className="text-2xl font-bold mb-2" style={{ color: '#1F2937' }}>
              할인쿠폰
            </div>
            <div className="text-base font-medium" style={{ color: '#6B7280' }}>
              철거 서비스 전 항목 적용
            </div>
          </div>


          {/* CTA 영역 */}
          <div>
            <motion.button
              onClick={() => navigate('/apply')}
              whileHover={{
                backgroundColor: '#0D47D9',
                y: -1,
                boxShadow: "0 4px 12px rgba(0, 95, 204, 0.3)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="text-white font-semibold transition-all duration-200"
              style={{
                backgroundColor: '#1456FF',
                padding: '12px 24px',
                borderRadius: '3px',
                fontSize: '14px',
                minHeight: '44px',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.13em'
              }}
            >
              할인쿠폰 받기
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Promo;
