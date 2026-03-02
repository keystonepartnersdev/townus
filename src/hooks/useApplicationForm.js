import { useState, useCallback } from 'react';

const INITIAL_FORM_DATA = {
  companyName: '',
  managerName: '',
  phoneNumber: '',
  siteAddress: '',
  buildingType: '',
  demolitionType: '',
  partialSpaces: [],
};

export const BUILDING_TYPES = [
  { value: 'apartment', label: '아파트', icon: '🏢' },
  { value: 'villa', label: '빌라', icon: '🏠', description: '다세대/다가구 포함' },
  { value: 'house', label: '단독주택', icon: '🏡' },
  { value: 'officetel', label: '오피스텔', icon: '🏬' },
  { value: 'other', label: '기타', icon: '🏗️', description: '상가, 사무실 등' },
];

export const DEMOLITION_TYPES = [
  { value: 'full', label: '전체철거', icon: '🏚️', description: '내부 전체 철거' },
  { value: 'partial', label: '부분철거', icon: '🔧', description: '특정 공간만 철거' },
];

export const SPACE_OPTIONS = [
  { value: 'living', label: '거실' },
  { value: 'kitchen', label: '주방' },
  { value: 'bathroom', label: '욕실' },
  { value: 'bedroom', label: '침실' },
  { value: 'balcony', label: '베란다' },
  { value: 'entrance', label: '현관' },
  { value: 'other', label: '기타' },
];

export const useApplicationForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1: forward, -1: backward
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // 부분철거 선택 시 스텝이 추가됨
  const getTotalSteps = useCallback(() => {
    if (formData.demolitionType === 'partial') {
      return 8; // 7 + 공간선택
    }
    return 7;
  }, [formData.demolitionType]);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const toggleSpace = useCallback((space) => {
    setFormData(prev => {
      const spaces = prev.partialSpaces.includes(space)
        ? prev.partialSpaces.filter(s => s !== space)
        : [...prev.partialSpaces, space];
      return { ...prev, partialSpaces: spaces };
    });
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
        return formData.buildingType !== '';
      case 6:
        return formData.demolitionType !== '';
      case 7:
        if (formData.demolitionType === 'partial') {
          return formData.partialSpaces.length > 0;
        }
        return true; // 확인 단계
      case 8:
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
      const payload = {
        companyName: formData.companyName,
        managerName: formData.managerName,
        phoneNumber: formData.phoneNumber,
        siteAddress: formData.siteAddress,
        buildingType: BUILDING_TYPES.find(b => b.value === formData.buildingType)?.label || '',
        demolitionType: DEMOLITION_TYPES.find(d => d.value === formData.demolitionType)?.label || '',
        partialSpaces: formData.partialSpaces
          .map(s => SPACE_OPTIONS.find(opt => opt.value === s)?.label)
          .join(', '),
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
    toggleSpace,
    formatPhoneNumber,
    goNext,
    goBack,
    goToStep,
    submit,
    reset,
  };
};
