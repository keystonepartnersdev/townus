import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/application/StepNavigation';
import TextInput from '../components/application/TextInput';
import AddressInput from '../components/application/AddressInput';
import SelectCard from '../components/application/SelectCard';
import SelectChip from '../components/application/SelectChip';
import SubmitButton from '../components/application/SubmitButton';
import ConfirmationStep from '../components/application/ConfirmationStep';
import SuccessView from '../components/application/SuccessView';
import {
  useApplicationForm,
  BUILDING_TYPES,
  DEMOLITION_TYPES,
  SPACE_OPTIONS,
} from '../hooks/useApplicationForm';

const pageVariants = {
  initial: (direction) => ({
    x: direction > 0 ? '30%' : '-30%',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? '-30%' : '30%',
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

const ApplicationPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    currentStep,
    totalSteps,
    direction,
    isSubmitting,
    isSubmitted,
    error,
    isValid,
    updateField,
    toggleSpace,
    formatPhoneNumber,
    goNext,
    goBack,
    goToStep,
    submit,
    reset,
  } = useApplicationForm();

  const handleGoHome = () => {
    navigate('/');
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    updateField('phoneNumber', formatted);
  };

  // 마지막 스텝인지 확인 (확인 페이지)
  const isConfirmationStep = currentStep === totalSteps;

  // 부분철거 공간 선택 스텝인지 확인
  const isSpaceSelectionStep = formData.demolitionType === 'partial' && currentStep === 7;

  const renderStep = () => {
    // 확인 스텝
    if (isConfirmationStep) {
      return (
        <ConfirmationStep
          formData={formData}
          onEdit={goToStep}
        />
      );
    }

    // 부분철거 공간 선택
    if (isSpaceSelectionStep) {
      return (
        <SelectChip
          question="어떤 공간을 철거할 예정인가요?"
          subtext="해당하는 공간을 모두 선택해주세요"
          options={SPACE_OPTIONS}
          selectedValues={formData.partialSpaces}
          onToggle={toggleSpace}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <TextInput
            question="회사명을 입력해주세요"
            value={formData.companyName}
            onChange={(v) => updateField('companyName', v)}
            placeholder="예: 주식회사 타운어스"
          />
        );
      case 2:
        return (
          <TextInput
            question="담당자 성함을 알려주세요"
            value={formData.managerName}
            onChange={(v) => updateField('managerName', v)}
            placeholder="예: 홍길동"
          />
        );
      case 3:
        return (
          <TextInput
            question={`연락 가능한 전화번호를\n입력해주세요`}
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            placeholder="010-0000-0000"
            type="tel"
          />
        );
      case 4:
        return (
          <AddressInput
            question={`철거할 현장 주소를\n입력해주세요`}
            value={formData.siteAddress}
            onChange={(v) => updateField('siteAddress', v)}
            placeholder="주소를 검색해주세요"
            helper="정확한 견적을 위해 상세주소까지 입력해주세요"
          />
        );
      case 5:
        return (
          <SelectCard
            question="어떤 유형의 건물인가요?"
            options={BUILDING_TYPES}
            value={formData.buildingType}
            onChange={(v) => updateField('buildingType', v)}
          />
        );
      case 6:
        return (
          <SelectCard
            question="어떤 철거가 필요하신가요?"
            options={DEMOLITION_TYPES}
            value={formData.demolitionType}
            onChange={(v) => updateField('demolitionType', v)}
          />
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (isConfirmationStep) {
      submit();
    } else {
      goNext();
    }
  };

  // 성공 화면
  if (isSubmitted) {
    return (
      <div className="application-page">
        <SuccessView onReset={reset} onGoHome={handleGoHome} />
      </div>
    );
  }

  return (
    <div className="application-page">
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={currentStep === 1 ? handleGoHome : goBack}
        canGoBack={true}
      />

      <main className="application-content">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="step-content"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {error && (
        <motion.div
          className="global-error"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <SubmitButton
        onClick={handleNext}
        disabled={!isValid}
        isLoading={isSubmitting}
        label={isConfirmationStep ? '신청 완료' : '다음'}
      />
    </div>
  );
};

export default ApplicationPage;
