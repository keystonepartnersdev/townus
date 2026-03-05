import { motion, AnimatePresence } from 'framer-motion';

const FloorStep = ({
  needed,
  types,
  additional,
  otherText,
  onNeededChange,
  onTypeToggle,
  onAdditionalToggle,
  onOtherTextChange,
}) => {
  const typeOptions = [
    { value: 'maru-bond', label: '마루(본드접착식)' },
    { value: 'laminate', label: '강화마루' },
    { value: 'deco-tile', label: '데코타일' },
    { value: 'vinyl', label: '장판' },
    { value: 'polishing-tile', label: '폴리싱타일' },
  ];

  const additionalOptions = [
    { value: 'hanji-sanding', label: '한지장판샌딩' },
    { value: 'floor-sanding', label: '바닥샌딩' },
    { value: 'other', label: '기타' },
  ];

  const isOtherSelected = additional.includes('other');

  return (
    <div className="floor-step-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        바닥 철거가 필요한가요?
      </motion.h1>

      {/* 필요 여부 선택 */}
      <motion.div
        className="select-cards floor-needed"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <button
          type="button"
          className={`select-card ${needed === 'yes' ? 'selected' : ''}`}
          onClick={() => onNeededChange('yes')}
        >
          <span className="select-card-icon">🪵</span>
          <div className="select-card-content">
            <span className="select-card-label">필요해요</span>
          </div>
          {needed === 'yes' && (
            <span className="select-card-check">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </span>
          )}
        </button>
        <button
          type="button"
          className={`select-card ${needed === 'no' ? 'selected' : ''}`}
          onClick={() => onNeededChange('no')}
        >
          <span className="select-card-icon">✋</span>
          <div className="select-card-content">
            <span className="select-card-label">필요 없어요</span>
          </div>
          {needed === 'no' && (
            <span className="select-card-check">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </span>
          )}
        </button>
      </motion.div>

      {/* 필요하다고 선택한 경우 추가 옵션 표시 */}
      <AnimatePresence>
        {needed === 'yes' && (
          <motion.div
            className="floor-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 바닥 타입 선택 */}
            <div className="floor-section">
              <p className="floor-section-title">바닥 종류를 선택해주세요</p>
              <p className="floor-section-subtitle">해당하는 항목을 모두 선택해주세요</p>
              <div className="select-chips">
                {typeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`select-chip ${types.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => onTypeToggle(option.value)}
                  >
                    {types.includes(option.value) && (
                      <svg className="chip-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 추가 선택 항목 */}
            <div className="floor-section">
              <p className="floor-section-title">추가 선택 항목</p>
              <p className="floor-section-subtitle">필요한 항목을 선택해주세요 (선택사항)</p>
              <div className="select-chips">
                {additionalOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`select-chip ${additional.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => onAdditionalToggle(option.value)}
                  >
                    {additional.includes(option.value) && (
                      <svg className="chip-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 기타 입력 */}
            <AnimatePresence>
              {isOtherSelected && (
                <motion.div
                  className="floor-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="floor-section-title">기타 항목을 입력해주세요</p>
                  <input
                    type="text"
                    className="input-underline"
                    value={otherText}
                    onChange={(e) => onOtherTextChange(e.target.value)}
                    placeholder="예: 기타 작업 내용"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloorStep;
