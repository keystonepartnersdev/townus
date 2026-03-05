import { motion } from 'framer-motion';
import { formatDesiredDate, RESIDENCE_STATUS, OTHER_TEAM_OPTIONS, BATHROOM_COUNT_OPTIONS, BATHROOM_ITEM_OPTIONS, KITCHEN_TYPE_OPTIONS, KITCHEN_SIZE_SMALL_OPTIONS, KITCHEN_SIZE_LARGE_OPTIONS, KITCHEN_ADDITIONAL_OPTIONS } from '../../hooks/useApplicationForm';

const ConfirmationStep = ({ formData, onEdit }) => {
  const desiredDateLabel = formatDesiredDate(formData.desiredDate);
  const residenceLabel = RESIDENCE_STATUS.find(r => r.value === formData.residenceStatus)?.label;
  const otherTeamLabel = OTHER_TEAM_OPTIONS.find(o => o.value === formData.hasOtherTeam)?.label;

  // 화장실 정보
  const bathroomNeededLabel = formData.bathroomNeeded === 'yes' ? '필요' : '불필요';
  const bathroomCountLabel = BATHROOM_COUNT_OPTIONS.find(c => c.value === formData.bathroomCount)?.label || '';
  const bathroomItemsLabel = formData.bathroomItems
    .map(item => BATHROOM_ITEM_OPTIONS.find(o => o.value === item)?.label)
    .filter(Boolean)
    .join(', ');

  const items = [
    { label: '회사명', value: formData.companyName, step: 1 },
    { label: '담당자명', value: formData.managerName, step: 2 },
    { label: '전화번호', value: formData.phoneNumber, step: 3 },
    { label: '현장주소', value: formData.siteAddress, step: 4 },
    { label: '희망 시공일', value: desiredDateLabel, step: 5 },
    { label: '거주 여부', value: residenceLabel, step: 6 },
    { label: '중복 공정', value: otherTeamLabel, step: 7 },
    { label: '화장실 철거', value: bathroomNeededLabel, step: 8 },
  ];

  // 화장실 필요시 상세 정보 추가
  if (formData.bathroomNeeded === 'yes') {
    items.push({ label: '화장실 개수', value: bathroomCountLabel, step: 8 });
    items.push({ label: '화장실 항목', value: bathroomItemsLabel + (formData.bathroomOther ? ` (${formData.bathroomOther})` : ''), step: 8 });
  }

  // 주방 정보
  const kitchenNeededLabel = formData.kitchenNeeded === 'yes' ? '필요' : '불필요';
  const kitchenTypeLabel = KITCHEN_TYPE_OPTIONS.find(t => t.value === formData.kitchenType)?.label || '';
  const kitchenSizeLabel = [...KITCHEN_SIZE_SMALL_OPTIONS, ...KITCHEN_SIZE_LARGE_OPTIONS].find(s => s.value === formData.kitchenSize)?.label || '';
  const kitchenOptionsLabel = formData.kitchenOptions
    .map(opt => KITCHEN_ADDITIONAL_OPTIONS.find(o => o.value === opt)?.label)
    .filter(Boolean)
    .join(', ');

  items.push({ label: '주방 철거', value: kitchenNeededLabel, step: 9 });

  // 주방 필요시 상세 정보 추가
  if (formData.kitchenNeeded === 'yes') {
    items.push({ label: '주방 형태', value: `${kitchenTypeLabel} (${kitchenSizeLabel})`, step: 9 });
    if (kitchenOptionsLabel) {
      items.push({ label: '주방 추가항목', value: kitchenOptionsLabel, step: 9 });
    }
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
