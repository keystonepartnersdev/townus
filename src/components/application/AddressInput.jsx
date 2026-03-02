import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DaumPostcodeEmbed from 'react-daum-postcode';

const AddressInput = ({
  question,
  value,
  onChange,
  placeholder,
  helper,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [baseAddress, setBaseAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  const handleComplete = (data) => {
    // 도로명 주소 우선, 없으면 지번 주소
    const fullAddress = data.roadAddress || data.jibunAddress;
    setBaseAddress(fullAddress);
    setDetailAddress('');
    onChange(fullAddress);
    setIsOpen(false);
  };

  const handleDetailChange = (e) => {
    const detail = e.target.value;
    setDetailAddress(detail);

    // baseAddress 기준으로 상세주소 결합
    if (detail.trim()) {
      onChange(`${baseAddress} ${detail}`);
    } else {
      onChange(baseAddress);
    }
  };

  // 표시용 주소 (기본주소만)
  const displayAddress = baseAddress || value;

  return (
    <div className="address-input-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {question.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < question.split('\n').length - 1 && <br />}
          </span>
        ))}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        {/* 주소 검색 버튼/필드 */}
        <button
          type="button"
          className={`address-search-button ${baseAddress ? 'has-value' : ''}`}
          onClick={() => setIsOpen(true)}
        >
          {baseAddress ? (
            <span className="address-value">{baseAddress}</span>
          ) : (
            <span className="address-placeholder">{placeholder}</span>
          )}
          <svg className="address-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 109 1a8 8 0 000 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 15l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* 다음 주소 검색 임베드 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="address-embed-wrapper"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="address-embed-header">
                <span>주소 검색</span>
                <button
                  type="button"
                  className="address-embed-close"
                  onClick={() => setIsOpen(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <DaumPostcodeEmbed
                onComplete={handleComplete}
                style={{ height: 400 }}
                autoClose={false}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 상세주소 입력 (주소 선택 후 표시) */}
        <AnimatePresence>
          {baseAddress && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                className="input-underline detail-address"
                value={detailAddress}
                onChange={handleDetailChange}
                placeholder="상세주소 입력 (동/호수)"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {helper && !isOpen && (
          <motion.p
            className="helper-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {helper}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default AddressInput;
