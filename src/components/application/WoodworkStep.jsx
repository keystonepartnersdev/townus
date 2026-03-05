import { motion, AnimatePresence } from 'framer-motion';

const WoodworkStep = ({
  needed,
  types,
  moldingArea,
  baseboardArea,
  doorTypes,
  doorCount,
  innerDoorCount,
  ceilingTypes,
  otherText,
  onNeededChange,
  onTypeToggle,
  onMoldingAreaChange,
  onBaseboardAreaChange,
  onDoorTypeToggle,
  onDoorCountChange,
  onInnerDoorCountChange,
  onCeilingTypeToggle,
  onOtherTextChange,
}) => {
  const typeOptions = [
    { value: 'molding', label: '몰딩' },
    { value: 'baseboard', label: '걸레받이' },
    { value: 'door', label: '도어' },
    { value: 'inner-door', label: '중문' },
    { value: 'ceiling', label: '천장철거' },
    { value: 'other', label: '기타' },
  ];

  const doorTypeOptions = [
    { value: 'full', label: '도어전체(문틀, 문짝, 문선 모두)' },
    { value: 'door-only', label: '도어만' },
    { value: 'trim-only', label: '문선만' },
    { value: 'threshold', label: '문턱' },
    { value: 'threshold-plaster', label: '문턱미장' },
  ];

  const countOptions = [
    { value: 'unknown', label: '미확인' },
    { value: '1', label: '1개' },
    { value: '2', label: '2개' },
    { value: '3', label: '3개' },
    { value: '4', label: '4개' },
    { value: '5+', label: '5개 이상' },
  ];

  const ceilingTypeOptions = [
    { value: 'full', label: '전체' },
    { value: 'well', label: '우물천장' },
    { value: 'light-box', label: '천장등박스' },
  ];

  const hasMolding = types.includes('molding');
  const hasBaseboard = types.includes('baseboard');
  const hasDoor = types.includes('door');
  const hasInnerDoor = types.includes('inner-door');
  const hasCeiling = types.includes('ceiling');
  const hasOther = types.includes('other');

  return (
    <div className="woodwork-step-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        목공 철거가 필요한가요?
      </motion.h1>

      {/* 필요 여부 선택 */}
      <motion.div
        className="select-cards woodwork-needed"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <button
          type="button"
          className={`select-card ${needed === 'yes' ? 'selected' : ''}`}
          onClick={() => onNeededChange('yes')}
        >
          <span className="select-card-icon">🪚</span>
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
            className="woodwork-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 목공 타입 선택 */}
            <div className="woodwork-section">
              <p className="woodwork-section-title">철거할 항목을 선택해주세요</p>
              <p className="woodwork-section-subtitle">해당하는 항목을 모두 선택해주세요</p>
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

            {/* 몰딩 평수 입력 */}
            <AnimatePresence>
              {hasMolding && (
                <motion.div
                  className="woodwork-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="woodwork-section-title">몰딩 철거 평수</p>
                  <input
                    type="text"
                    className="input-underline"
                    value={moldingArea}
                    onChange={(e) => onMoldingAreaChange(e.target.value)}
                    placeholder="예: 32평"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 걸레받이 평수 입력 */}
            <AnimatePresence>
              {hasBaseboard && (
                <motion.div
                  className="woodwork-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="woodwork-section-title">걸레받이 철거 평수</p>
                  <input
                    type="text"
                    className="input-underline"
                    value={baseboardArea}
                    onChange={(e) => onBaseboardAreaChange(e.target.value)}
                    placeholder="예: 32평"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 도어 옵션 */}
            <AnimatePresence>
              {hasDoor && (
                <motion.div
                  className="woodwork-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="woodwork-section-title">도어 철거 항목</p>
                  <p className="woodwork-section-subtitle">해당하는 항목을 모두 선택해주세요</p>
                  <div className="select-chips">
                    {doorTypeOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        className={`select-chip ${doorTypes.includes(option.value) ? 'selected' : ''}`}
                        onClick={() => onDoorTypeToggle(option.value)}
                      >
                        {doorTypes.includes(option.value) && (
                          <svg className="chip-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <p className="woodwork-section-title" style={{ marginTop: '16px' }}>도어 갯수</p>
                  <div className="count-chips">
                    {countOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        className={`count-chip ${doorCount === option.value ? 'selected' : ''}`}
                        onClick={() => onDoorCountChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 중문 갯수 */}
            <AnimatePresence>
              {hasInnerDoor && (
                <motion.div
                  className="woodwork-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="woodwork-section-title">중문 갯수</p>
                  <div className="count-chips">
                    {countOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        className={`count-chip ${innerDoorCount === option.value ? 'selected' : ''}`}
                        onClick={() => onInnerDoorCountChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 천장 옵션 */}
            <AnimatePresence>
              {hasCeiling && (
                <motion.div
                  className="woodwork-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="woodwork-section-title">천장 철거 항목</p>
                  <p className="woodwork-section-subtitle">해당하는 항목을 모두 선택해주세요</p>
                  <div className="select-chips">
                    {ceilingTypeOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        className={`select-chip ${ceilingTypes.includes(option.value) ? 'selected' : ''}`}
                        onClick={() => onCeilingTypeToggle(option.value)}
                      >
                        {ceilingTypes.includes(option.value) && (
                          <svg className="chip-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 기타 입력 */}
            <AnimatePresence>
              {hasOther && (
                <motion.div
                  className="woodwork-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="woodwork-section-title">기타 항목을 입력해주세요</p>
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

export default WoodworkStep;
