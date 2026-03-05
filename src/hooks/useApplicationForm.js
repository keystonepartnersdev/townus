import { useState, useCallback } from 'react';

const INITIAL_FORM_DATA = {
  companyName: '',
  managerName: '',
  phoneNumber: '',
  siteAddress: '',
  desiredDate: '',
  residenceStatus: '',
  hasOtherTeam: '',
  bathroomNeeded: '',
  bathroomCount: '',
  bathroomItems: [],
  bathroomOther: '',
  kitchenNeeded: '',
  kitchenType: '',
  kitchenSize: '',
  kitchenOptions: [],
};

// 날짜 포맷팅 헬퍼 함수
export const formatDesiredDate = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[d.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

export const RESIDENCE_STATUS = [
  { value: 'occupied', label: '거주중', icon: '🏠', description: '현재 거주하고 있어요' },
  { value: 'vacant', label: '비거주중', icon: '🔑', description: '현재 비어있어요' },
];

export const OTHER_TEAM_OPTIONS = [
  { value: 'yes', label: '중복 공정 존재', icon: '👥', description: '다른 팀도 함께 작업해요' },
  { value: 'no', label: '없음', icon: '✋', description: '철거팀만 작업해요' },
];

export const BATHROOM_COUNT_OPTIONS = [
  { value: '1', label: '1개' },
  { value: '2', label: '2개' },
  { value: '3', label: '3개' },
  { value: '3+', label: '3개 이상' },
];

export const BATHROOM_ITEM_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'ceiling', label: '천장 및 내부기구' },
  { value: 'tile', label: '벽 바닥 타일' },
  { value: 'ubr', label: 'UBR' },
  { value: 'other', label: '기타' },
];

export const KITCHEN_TYPE_OPTIONS = [
  { value: 'straight', label: '-자형' },
  { value: 'l-shape', label: 'ㄱ자형' },
  { value: 'u-shape', label: 'ㄷ자형' },
  { value: 'square', label: 'ㅁ자형' },
];

export const KITCHEN_SIZE_SMALL_OPTIONS = [
  { value: 'under-3.5', label: '3.5M 이하' },
  { value: 'over-3.5', label: '3.5M 이상' },
];

export const KITCHEN_SIZE_LARGE_OPTIONS = [
  { value: 'under-12', label: '12M 이하' },
  { value: 'over-12', label: '12M 이상' },
];

export const KITCHEN_ADDITIONAL_OPTIONS = [
  { value: 'island', label: '아일랜드' },
  { value: 'balcony', label: '발코니' },
  { value: 'sub-kitchen', label: '보조주방' },
  { value: 'appliances', label: '옵션기기' },
  { value: 'plumbing', label: '입수전 공사' },
];

export const useApplicationForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1: forward, -1: backward
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // 총 스텝 수 (확인 페이지 포함 10단계)
  const getTotalSteps = useCallback(() => {
    return 10;
  }, []);

  const toggleBathroomItem = useCallback((item) => {
    setFormData(prev => {
      const items = prev.bathroomItems.includes(item)
        ? prev.bathroomItems.filter(i => i !== item)
        : [...prev.bathroomItems, item];
      return { ...prev, bathroomItems: items };
    });
  }, []);

  const toggleKitchenOption = useCallback((option) => {
    setFormData(prev => {
      const options = prev.kitchenOptions.includes(option)
        ? prev.kitchenOptions.filter(o => o !== option)
        : [...prev.kitchenOptions, option];
      return { ...prev, kitchenOptions: options };
    });
  }, []);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  // 전화번호 포맷팅
  const formatPhoneNumber = useCallback((value) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }, []);

  // 현재 스텝 유효성 검사
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.companyName.trim().length >= 2;
      case 2:
        return formData.managerName.trim().length >= 2;
      case 3: {
        const phone = formData.phoneNumber.replace(/-/g, '');
        return /^01[016789]\d{7,8}$/.test(phone);
      }
      case 4:
        return formData.siteAddress.trim().length >= 5;
      case 5:
        return formData.desiredDate !== '';
      case 6:
        return formData.residenceStatus !== '';
      case 7:
        return formData.hasOtherTeam !== '';
      case 8:
        // 화장실 철거: 필요없음이면 통과, 필요하면 개수와 항목 필수
        if (formData.bathroomNeeded === 'no') return true;
        if (formData.bathroomNeeded === 'yes') {
          const hasCount = formData.bathroomCount !== '';
          const hasItems = formData.bathroomItems.length > 0;
          const hasOtherText = !formData.bathroomItems.includes('other') || formData.bathroomOther.trim().length > 0;
          return hasCount && hasItems && hasOtherText;
        }
        return formData.bathroomNeeded !== '';
      case 9:
        // 주방 철거: 필요없음이면 통과, 필요하면 타입과 사이즈 필수
        if (formData.kitchenNeeded === 'no') return true;
        if (formData.kitchenNeeded === 'yes') {
          const hasType = formData.kitchenType !== '';
          const hasSize = formData.kitchenSize !== '';
          return hasType && hasSize;
        }
        return formData.kitchenNeeded !== '';
      case 10:
        return true; // 확인 단계
      default:
        return false;
    }
  }, [currentStep, formData]);

  const goNext = useCallback(() => {
    if (validateCurrentStep()) {
      setDirection(1);
      setCurrentStep(prev => Math.min(prev + 1, getTotalSteps()));
    }
  }, [validateCurrentStep, getTotalSteps]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  }, [currentStep]);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const bathroomItemLabels = formData.bathroomItems
        .map(item => BATHROOM_ITEM_OPTIONS.find(o => o.value === item)?.label)
        .filter(Boolean)
        .join(', ');

      const payload = {
        companyName: formData.companyName,
        managerName: formData.managerName,
        phoneNumber: formData.phoneNumber,
        siteAddress: formData.siteAddress,
        desiredDate: formatDesiredDate(formData.desiredDate),
        residenceStatus: RESIDENCE_STATUS.find(r => r.value === formData.residenceStatus)?.label || '',
        hasOtherTeam: OTHER_TEAM_OPTIONS.find(o => o.value === formData.hasOtherTeam)?.label || '',
        bathroomNeeded: formData.bathroomNeeded === 'yes' ? '필요' : '불필요',
        bathroomCount: formData.bathroomNeeded === 'yes' ? (BATHROOM_COUNT_OPTIONS.find(c => c.value === formData.bathroomCount)?.label || '') : '',
        bathroomItems: formData.bathroomNeeded === 'yes' ? bathroomItemLabels : '',
        bathroomOther: formData.bathroomOther,
        kitchenNeeded: formData.kitchenNeeded === 'yes' ? '필요' : '불필요',
        kitchenType: formData.kitchenNeeded === 'yes' ? (KITCHEN_TYPE_OPTIONS.find(t => t.value === formData.kitchenType)?.label || '') : '',
        kitchenSize: formData.kitchenNeeded === 'yes' ? (
          [...KITCHEN_SIZE_SMALL_OPTIONS, ...KITCHEN_SIZE_LARGE_OPTIONS].find(s => s.value === formData.kitchenSize)?.label || ''
        ) : '',
        kitchenOptions: formData.kitchenNeeded === 'yes' ? (
          formData.kitchenOptions.map(opt => KITCHEN_ADDITIONAL_OPTIONS.find(o => o.value === opt)?.label).filter(Boolean).join(', ')
        ) : '',
        timestamp: new Date().toLocaleString('ko-KR'),
        source: 'TownUs Website - New Application Form',
      };

      // Google Sheets webhook
      const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwwgYuK9jlNQw6e2kLk64XaV1I1dyjguOZUMpWHYhXi6kKW7NJ2fR4BSItidw4DqGkN/exec';

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(payload),
      });

      setIsSubmitted(true);
    } catch (err) {
      setError('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setIsSubmitted(false);
    setError(null);
  }, []);

  return {
    formData,
    currentStep,
    totalSteps: getTotalSteps(),
    direction,
    isSubmitting,
    isSubmitted,
    error,
    isValid: validateCurrentStep(),
    updateField,
    toggleBathroomItem,
    toggleKitchenOption,
    formatPhoneNumber,
    goNext,
    goBack,
    goToStep,
    submit,
    reset,
  };
};
