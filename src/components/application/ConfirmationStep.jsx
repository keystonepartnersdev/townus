import { motion } from 'framer-motion';
import { BUILDING_TYPES, DEMOLITION_TYPES, SPACE_OPTIONS } from '../../hooks/useApplicationForm';

const ConfirmationStep = ({ formData, onEdit }) => {
  const buildingLabel = BUILDING_TYPES.find(b => b.value === formData.buildingType)?.label;
  const demolitionLabel = DEMOLITION_TYPES.find(d => d.value === formData.demolitionType)?.label;
  const spacesLabels = formData.partialSpaces
    .map(s => SPACE_OPTIONS.find(opt => opt.value === s)?.label)
    .join(', ');

  const items = [
    { label: '회사명', value: formData.companyName, step: 1 },
    { label: '담당자명', value: formData.managerName, step: 2 },
    { label: '전화번호', value: formData.phoneNumber, step: 3 },
    { label: '현장주소', value: formData.siteAddress, step: 4 },
    { label: '주거유형', value: buildingLabel, step: 5 },
    { label: '철거유형', value: demolitionLabel, step: 6 },
  ];

  if (formData.demolitionType === 'partial' && formData.partialSpaces.length > 0) {
    items.push({ label: '철거 공간', value: spacesLabels, step: 7 });
  }

  return (
    <div className="confirmation-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        입력하신 정보를<br />확인해주세요
      </motion.h1>

      <motion.div
        className="confirmation-items"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            className="confirmation-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
          >
            <div className="confirmation-item-content">
              <span className="confirmation-label">{item.label}</span>
              <span className="confirmation-value">{item.value}</span>
            </div>
            <button
              className="confirmation-edit"
              onClick={() => onEdit(item.step)}
            >
              수정
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        className="confirmation-notice"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        신청 후 담당자가 빠른 시일 내에<br />연락드리겠습니다
      </motion.p>
    </div>
  );
};

export default ConfirmationStep;
