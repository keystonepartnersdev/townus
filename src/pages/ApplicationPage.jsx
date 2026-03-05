import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StepNavigation from '../components/application/StepNavigation';
import TextInput from '../components/application/TextInput';
import AddressInput from '../components/application/AddressInput';
import DateInput from '../components/application/DateInput';
import SelectCard from '../components/application/SelectCard';
import BathroomStep from '../components/application/BathroomStep';
import KitchenStep from '../components/application/KitchenStep';
import SubmitButton from '../components/application/SubmitButton';
import ConfirmationStep from '../components/application/ConfirmationStep';
import SuccessView from '../components/application/SuccessView';
import {
  useApplicationForm,
  RESIDENCE_STATUS,
  OTHER_TEAM_OPTIONS,
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
    toggleBathroomItem,
    toggleKitchenOption,
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
          <DateInput
            question={`희망하시는 시공일을\n선택해주세요`}
            value={formData.desiredDate}
            onChange={(v) => updateField('desiredDate', v)}
            placeholder="날짜를 선택해주세요"
          />
        );
      case 6:
        return (
          <SelectCard
            question="현재 거주 중이신가요?"
            options={RESIDENCE_STATUS}
            value={formData.residenceStatus}
            onChange={(v) => updateField('residenceStatus', v)}
          />
        );
      case 7:
        return (
          <SelectCard
            question="다른 철거팀도 작업하나요?"
            options={OTHER_TEAM_OPTIONS}
            value={formData.hasOtherTeam}
            onChange={(v) => updateField('hasOtherTeam', v)}
          />
        );
      case 8:
        return (
          <BathroomStep
            needed={formData.bathroomNeeded}
            count={formData.bathroomCount}
            items={formData.bathroomItems}
            otherText={formData.bathroomOther}
            onNeededChange={(v) => updateField('bathroomNeeded', v)}
            onCountChange={(v) => updateField('bathroomCount', v)}
            onItemToggle={toggleBathroomItem}
            onOtherTextChange={(v) => updateField('bathroomOther', v)}
          />
        );
      case 9:
        return (
          <KitchenStep
            needed={formData.kitchenNeeded}
            type={formData.kitchenType}
            size={formData.kitchenSize}
            options={formData.kitchenOptions}
            onNeededChange={(v) => updateField('kitchenNeeded', v)}
            onTypeChange={(v) => updateField('kitchenType', v)}
            onSizeChange={(v) => updateField('kitchenSize', v)}
            onOptionToggle={toggleKitchenOption}
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
