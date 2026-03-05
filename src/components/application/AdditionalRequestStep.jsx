import { motion } from 'framer-motion';

const AdditionalRequestStep = ({ value, onChange }) => {
  return (
    <div className="additional-request-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        기타 추가 요청사항이<br />있으신가요?
      </motion.h1>

      <motion.div
        className="additional-request-content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <p className="additional-request-subtitle">
          추가로 요청하실 사항이 있으시면 자유롭게 입력해주세요 (선택사항)
        </p>
        <textarea
          className="additional-request-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="예: 특정 시간대 작업 요청, 주의사항, 기타 문의 등"
          rows={5}
        />
      </motion.div>
    </div>
  );
};

export default AdditionalRequestStep;
