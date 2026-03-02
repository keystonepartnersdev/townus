const StepNavigation = ({ currentStep, totalSteps, onBack, canGoBack = true }) => {
  return (
    <header className="step-navigation">
      <button
        className="back-button"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="뒤로가기"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18L9 12L15 6" />
        </svg>
      </button>

      <span className="step-counter">
        {currentStep} / {totalSteps}
      </span>
    </header>
  );
};

export default StepNavigation;
