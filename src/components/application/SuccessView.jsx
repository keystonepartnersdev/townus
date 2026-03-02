import { motion } from 'framer-motion';

const SuccessView = ({ onReset, onGoHome }) => {
  return (
    <div className="success-container">
      <motion.div
        className="success-icon"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
      >
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
          <circle cx="44" cy="44" r="44" fill="#E8F5E9"/>
          <motion.path
            d="M26 44L38 56L62 32"
            stroke="#00C73C"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </svg>
      </motion.div>

      <motion.h1
        className="success-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        신청이 완료되었습니다
      </motion.h1>

      <motion.p
        className="success-message"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        담당자가 영업일 기준 1~2일 내에<br />
        입력하신 연락처로 연락드리겠습니다
      </motion.p>

      <motion.div
        className="success-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button className="success-button primary" onClick={onGoHome}>
          홈으로 돌아가기
        </button>
        <button className="success-button secondary" onClick={onReset}>
          추가 신청하기
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessView;
