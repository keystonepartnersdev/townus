import { motion, AnimatePresence } from 'framer-motion';

const KitchenStep = ({
  needed,
  type,
  size,
  options,
  onNeededChange,
  onTypeChange,
  onSizeChange,
  onOptionToggle,
}) => {
  const typeOptions = [
    { value: 'straight', label: '-자형' },
    { value: 'l-shape', label: 'ㄱ자형' },
    { value: 'u-shape', label: 'ㄷ자형' },
    { value: 'square', label: 'ㅁ자형' },
  ];

  const smallSizeOptions = [
    { value: 'under-3.5', label: '3.5M 이하' },
    { value: 'over-3.5', label: '3.5M 이상' },
  ];

  const largeSizeOptions = [
    { value: 'under-12', label: '12M 이하' },
    { value: 'over-12', label: '12M 이상' },
  ];

  const additionalOptions = [
    { value: 'island', label: '아일랜드' },
    { value: 'balcony', label: '발코니' },
    { value: 'sub-kitchen', label: '보조주방' },
    { value: 'appliances', label: '옵션기기' },
    { value: 'plumbing', label: '입수전 공사' },
  ];

  // 선택된 주방 타입에 따른 사이즈 옵션
  const isSmallType = type === 'straight' || type === 'l-shape';
  const isLargeType = type === 'u-shape' || type === 'square';
  const sizeOptions = isSmallType ? smallSizeOptions : isLargeType ? largeSizeOptions : [];

  return (
    <div className="kitchen-step-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        주방 철거가 필요한가요?
      </motion.h1>

      {/* 필요 여부 선택 */}
      <motion.div
        className="select-cards kitchen-needed"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <button
          type="button"
          className={`select-card ${needed === 'yes' ? 'selected' : ''}`}
          onClick={() => onNeededChange('yes')}
        >
          <span className="select-card-icon">🍳</span>
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
            className="kitchen-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 주방 타입 선택 */}
            <div className="kitchen-section">
              <p className="kitchen-section-title">주방 형태를 선택해주세요</p>
              <div className="type-chips">
                {typeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`type-chip ${type === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      onTypeChange(option.value);
                      onSizeChange(''); // 타입 변경시 사이즈 초기화
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 사이즈 선택 - 타입 선택 후에만 표시 */}
            <AnimatePresence>
              {(isSmallType || isLargeType) && (
                <motion.div
                  className="kitchen-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="kitchen-section-title">주방 길이를 선택해주세요</p>
                  <div className="size-chips">
                    {sizeOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        className={`size-chip ${size === option.value ? 'selected' : ''}`}
                        onClick={() => onSizeChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 추가 옵션 선택 */}
            <div className="kitchen-section">
              <p className="kitchen-section-title">추가 항목 (선택사항)</p>
              <p className="kitchen-section-subtitle">해당하는 항목이 있으면 선택해주세요</p>
              <div className="select-chips">
                {additionalOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`select-chip ${options.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => onOptionToggle(option.value)}
                  >
                    {options.includes(option.value) && (
                      <svg className="chip-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KitchenStep;
