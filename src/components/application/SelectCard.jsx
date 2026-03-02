import { motion } from 'framer-motion';

const SelectCard = ({
  question,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="select-card-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {question}
      </motion.h1>

      <div className="select-cards">
        {options.map((option, index) => (
          <motion.button
            key={option.value}
            type="button"
            className={`select-card ${value === option.value ? 'selected' : ''}`}
            onClick={() => onChange(option.value)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.08 * index,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <span className="select-card-icon">{option.icon}</span>
            <div className="select-card-content">
              <span className="select-card-label">{option.label}</span>
              {option.description && (
                <span className="select-card-description">{option.description}</span>
              )}
            </div>
            {value === option.value && (
              <motion.div
                className="select-card-check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#1456FF"/>
                  <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SelectCard;
