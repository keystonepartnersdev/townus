import { motion, AnimatePresence } from 'framer-motion';

const FurnitureStep = ({
  needed,
  types,
  otherText,
  onNeededChange,
  onTypeToggle,
  onOtherTextChange,
}) => {
  const typeOptions = [
    { value: 'entrance', label: '현관장' },
    { value: 'builtin', label: '붙박이장' },
    { value: 'movable', label: '이동장' },
    { value: 'wall-mounted', label: '벽박이장' },
    { value: 'living-room', label: '거실장' },
    { value: 'vanity', label: '화장대' },
    { value: 'other', label: '기타' },
  ];

  const isOtherSelected = types.includes('other');

  return (
    <div className="furniture-step-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        가구 철거가 필요한가요?
      </motion.h1>

      {/* 필요 여부 선택 */}
      <motion.div
        className="select-cards furniture-needed"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <button
          type="button"
          className={`select-card ${needed === 'yes' ? 'selected' : ''}`}
          onClick={() => onNeededChange('yes')}
        >
          <span className="select-card-icon">🪑</span>
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
            className="furniture-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 가구 타입 선택 */}
            <div className="furniture-section">
              <p className="furniture-section-title">철거할 가구를 선택해주세요</p>
              <p className="furniture-section-subtitle">해당하는 항목을 모두 선택해주세요</p>
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

            {/* 기타 입력 */}
            <AnimatePresence>
              {isOtherSelected && (
                <motion.div
                  className="furniture-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="furniture-section-title">기타 항목을 입력해주세요</p>
                  <input
                    type="text"
                    className="input-underline"
                    value={otherText}
                    onChange={(e) => onOtherTextChange(e.target.value)}
                    placeholder="예: 책장, 신발장 등"
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

export default FurnitureStep;
