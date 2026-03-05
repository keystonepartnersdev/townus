import { motion, AnimatePresence } from 'framer-motion';

const BathroomStep = ({
  needed,
  count,
  items,
  otherText,
  additional,
  additionalOtherText,
  onNeededChange,
  onCountChange,
  onItemToggle,
  onOtherTextChange,
  onAdditionalToggle,
  onAdditionalOtherTextChange,
}) => {
  const countOptions = [
    { value: '1', label: '1개' },
    { value: '2', label: '2개' },
    { value: '3', label: '3개' },
    { value: '3+', label: '3개 이상' },
  ];

  const itemOptions = [
    { value: 'all', label: '전체' },
    { value: 'ceiling', label: '천장 및 내부기구' },
    { value: 'tile', label: '벽 바닥 타일' },
    { value: 'ubr', label: 'UBR' },
    { value: 'other', label: '기타' },
  ];

  const additionalOptions = [
    { value: 'new-pipe', label: '급수관신설' },
    { value: 'move-pipe', label: '급수관이동' },
    { value: 'p-trap', label: '욕실P트랩 전환' },
    { value: 'zendai', label: '젠다이시공' },
    { value: 'other', label: '기타' },
  ];

  const isOtherSelected = items.includes('other');
  const isAdditionalOtherSelected = additional.includes('other');

  return (
    <div className="bathroom-step-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        화장실 철거가 필요한가요?
      </motion.h1>

      {/* 필요 여부 선택 */}
      <motion.div
        className="select-cards bathroom-needed"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <button
          type="button"
          className={`select-card ${needed === 'yes' ? 'selected' : ''}`}
          onClick={() => onNeededChange('yes')}
        >
          <span className="select-card-icon">🚿</span>
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
            className="bathroom-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 개수 선택 */}
            <div className="bathroom-section">
              <p className="bathroom-section-title">몇 개의 화장실을 철거하나요?</p>
              <div className="count-chips">
                {countOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`count-chip ${count === option.value ? 'selected' : ''}`}
                    onClick={() => onCountChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 항목 선택 */}
            <div className="bathroom-section">
              <p className="bathroom-section-title">철거 항목을 선택해주세요</p>
              <p className="bathroom-section-subtitle">해당하는 항목을 모두 선택해주세요</p>
              <div className="select-chips">
                {itemOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`select-chip ${items.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => onItemToggle(option.value)}
                  >
                    {items.includes(option.value) && (
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
                  className="bathroom-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="bathroom-section-title">기타 항목을 입력해주세요</p>
                  <input
                    type="text"
                    className="input-underline"
                    value={otherText}
                    onChange={(e) => onOtherTextChange(e.target.value)}
                    placeholder="예: 세면대, 변기 등"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 추가 선택 항목 */}
            <div className="bathroom-section">
              <p className="bathroom-section-title">추가 선택 항목</p>
              <p className="bathroom-section-subtitle">필요한 항목을 선택해주세요 (선택사항)</p>
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

            {/* 추가항목 기타 입력 */}
            <AnimatePresence>
              {isAdditionalOtherSelected && (
                <motion.div
                  className="bathroom-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="bathroom-section-title">추가 기타 항목을 입력해주세요</p>
                  <input
                    type="text"
                    className="input-underline"
                    value={additionalOtherText}
                    onChange={(e) => onAdditionalOtherTextChange(e.target.value)}
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

export default BathroomStep;
