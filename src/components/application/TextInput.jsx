import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TextInput = ({
  question,
  subtext,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  helper,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto focus with slight delay for animation
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-input-container">
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <input
          ref={inputRef}
          type={type}
          className={`input-underline ${error ? 'error' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={type === 'tel' ? 'numeric' : 'text'}
          autoComplete="off"
        />

        {error && (
          <motion.p
            className="error-message"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 5a1 1 0 112 0v3a1 1 0 11-2 0V5zm1 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            {error}
          </motion.p>
        )}

        {helper && !error && (
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

export default TextInput;
