import { motion } from 'framer-motion';

const SelectChip = ({
  question,
  subtext,
  options,
  selectedValues,
  onToggle,
}) => {
  return (
    <div className="select-chip-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {question}
      </motion.h1>

      {subtext && (
        <motion.p
          className="step-subtext"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {subtext}
        </motion.p>
      )}

      <div className="select-chips">
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <motion.button
              key={option.value}
              type="button"
              className={`select-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggle(option.value)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.05 * index,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {isSelected && (
                <motion.svg
                  className="chip-check"
                  viewBox="0 0 18 18"
                  fill="none"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <path
                    d="M4 9L7.5 12.5L14 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              )}
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectChip;
