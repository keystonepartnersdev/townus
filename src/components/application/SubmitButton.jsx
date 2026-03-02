const SubmitButton = ({
  onClick,
  disabled,
  isLoading,
  label = '다음',
}) => {
  return (
    <div className="submit-button-container">
      <button
        type="button"
        className={`submit-button ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <span className="loading-spinner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="50"
                strokeDashoffset="15"
              />
            </svg>
          </span>
        ) : (
          label
        )}
      </button>
    </div>
  );
};

export default SubmitButton;
