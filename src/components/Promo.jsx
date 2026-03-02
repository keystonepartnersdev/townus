import { motion } from 'framer-motion';

const Promo = ({ openModal }) => {

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
          <div className="inline-flex items-center px-4 py-2 rounded-full mb-6" style={{ background: '#005FCC' }}>
            <span className="text-white font-semibold text-sm">서비스 10주년 기념</span>
          </div>


          {/* 할인 강조 */}
          <div className="mb-8">
            <div className="text-5xl font-black mb-3" style={{ color: '#005FCC' }}>
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
              onClick={() => openModal("할인쿠폰 받기")}
              whileHover={{ 
                backgroundColor: '#004FA0',
                boxShadow: "0 8px 25px rgba(0, 95, 204, 0.3)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="text-white font-semibold rounded-xl transition-all duration-300 text-base px-6 py-3 md:px-8 md:py-4"
              style={{
                backgroundColor: '#005FCC',
                minHeight: '44px',
                border: 'none'
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