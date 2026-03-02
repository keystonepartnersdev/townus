import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer 
      className="border-t"
      style={{ 
        backgroundColor: '#000000',
        borderTopColor: '#333333'
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20 py-10 md:py-15">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          {/* 회사 정보 */}
          <div className="mb-8">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h3 className="text-base font-semibold text-white">
                주식회사 타운어스
              </h3>
            </div>
            <p 
              className="text-sm mb-6"
              style={{ color: '#E0F2FE' }}
            >
              경기도 시흥시 월곶동 10번길 8
            </p>
          </div>

          {/* 연락처 정보 */}
          <div className="mb-8 space-y-2">
            <div className="text-sm text-white">
              <span className="font-medium">이메일:</span> master@town-us.com
            </div>
          </div>


          {/* 구분선 */}
          <div 
            className="border-t my-6"
            style={{ borderTopColor: 'rgba(255,255,255,0.2)' }}
          />

          {/* 정책 링크 */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
              <motion.a
                href="#"
                whileHover={{ 
                  color: '#FFFFFF',
                  textDecoration: 'underline',
                  transition: { duration: 0.3 }
                }}
                className="text-sm transition-all duration-300"
                style={{ color: '#E0F2FE' }}
              >
                개인정보처리방침
              </motion.a>
              
              <span 
                className="text-sm"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                |
              </span>
              
              <motion.a
                href="#"
                whileHover={{ 
                  color: '#FFFFFF',
                  textDecoration: 'underline',
                  transition: { duration: 0.3 }
                }}
                className="text-sm transition-all duration-300"
                style={{ color: '#E0F2FE' }}
              >
                이용약관
              </motion.a>
              
              <span 
                className="text-sm"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                |
              </span>
              
              <motion.a
                href="#"
                whileHover={{ 
                  color: '#FFFFFF',
                  textDecoration: 'underline',
                  transition: { duration: 0.3 }
                }}
                className="text-sm transition-all duration-300"
                style={{ color: '#E0F2FE' }}
              >
                수수료표준
              </motion.a>
            </div>
          </div>

          {/* 저작권 */}
          <div 
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
© 2025 Keystone Partners. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;