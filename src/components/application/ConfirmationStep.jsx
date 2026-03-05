import { motion } from 'framer-motion';
import { formatDesiredDate, RESIDENCE_STATUS, OTHER_TEAM_OPTIONS, BATHROOM_COUNT_OPTIONS, BATHROOM_ITEM_OPTIONS, BATHROOM_ADDITIONAL_OPTIONS, KITCHEN_TYPE_OPTIONS, KITCHEN_SIZE_SMALL_OPTIONS, KITCHEN_SIZE_LARGE_OPTIONS, KITCHEN_ADDITIONAL_OPTIONS, FLOOR_TYPE_OPTIONS, FLOOR_ADDITIONAL_OPTIONS, FURNITURE_TYPE_OPTIONS, WOODWORK_TYPE_OPTIONS, DOOR_TYPE_OPTIONS, DOOR_COUNT_OPTIONS, CEILING_TYPE_OPTIONS } from '../../hooks/useApplicationForm';

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

    // 추가 선택 항목
    const bathroomAdditionalLabel = formData.bathroomAdditional
      .map(item => BATHROOM_ADDITIONAL_OPTIONS.find(o => o.value === item)?.label)
      .filter(Boolean)
      .join(', ');
    if (bathroomAdditionalLabel) {
      items.push({ label: '화장실 추가항목', value: bathroomAdditionalLabel + (formData.bathroomAdditionalOther ? ` (${formData.bathroomAdditionalOther})` : ''), step: 8 });
    }
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
      items.push({ label: '주방 추가항목', value: kitchenOptionsLabel + (formData.kitchenOther ? ` (${formData.kitchenOther})` : ''), step: 9 });
    }
  }

  // 바닥 정보
  const floorNeededLabel = formData.floorNeeded === 'yes' ? '필요' : '불필요';
  const floorTypesLabel = formData.floorTypes
    .map(type => FLOOR_TYPE_OPTIONS.find(t => t.value === type)?.label)
    .filter(Boolean)
    .join(', ');
  const floorAdditionalLabel = formData.floorAdditional
    .map(opt => FLOOR_ADDITIONAL_OPTIONS.find(o => o.value === opt)?.label)
    .filter(Boolean)
    .join(', ');

  items.push({ label: '바닥 철거', value: floorNeededLabel, step: 10 });

  // 바닥 필요시 상세 정보 추가
  if (formData.floorNeeded === 'yes') {
    items.push({ label: '바닥 종류', value: floorTypesLabel, step: 10 });
    if (floorAdditionalLabel) {
      items.push({ label: '바닥 추가항목', value: floorAdditionalLabel + (formData.floorOther ? ` (${formData.floorOther})` : ''), step: 10 });
    }
  }

  // 가구 정보
  const furnitureNeededLabel = formData.furnitureNeeded === 'yes' ? '필요' : '불필요';
  const furnitureTypesLabel = formData.furnitureTypes
    .map(type => FURNITURE_TYPE_OPTIONS.find(t => t.value === type)?.label)
    .filter(Boolean)
    .join(', ');

  items.push({ label: '가구 철거', value: furnitureNeededLabel, step: 11 });

  // 가구 필요시 상세 정보 추가
  if (formData.furnitureNeeded === 'yes') {
    items.push({ label: '가구 종류', value: furnitureTypesLabel + (formData.furnitureOther ? ` (${formData.furnitureOther})` : ''), step: 11 });
  }

  // 목공 정보
  const woodworkNeededLabel = formData.woodworkNeeded === 'yes' ? '필요' : '불필요';
  const woodworkTypesLabel = formData.woodworkTypes
    .map(type => WOODWORK_TYPE_OPTIONS.find(t => t.value === type)?.label)
    .filter(Boolean)
    .join(', ');

  items.push({ label: '목공 철거', value: woodworkNeededLabel, step: 12 });

  // 목공 필요시 상세 정보 추가
  if (formData.woodworkNeeded === 'yes') {
    items.push({ label: '목공 항목', value: woodworkTypesLabel, step: 12 });

    if (formData.woodworkTypes.includes('molding') && formData.woodworkMoldingArea) {
      items.push({ label: '몰딩 평수', value: formData.woodworkMoldingArea, step: 12 });
    }
    if (formData.woodworkTypes.includes('baseboard') && formData.woodworkBaseboardArea) {
      items.push({ label: '걸레받이 평수', value: formData.woodworkBaseboardArea, step: 12 });
    }
    if (formData.woodworkTypes.includes('door')) {
      const doorTypesLabel = formData.woodworkDoorTypes
        .map(type => DOOR_TYPE_OPTIONS.find(t => t.value === type)?.label)
        .filter(Boolean)
        .join(', ');
      const doorCountLabel = DOOR_COUNT_OPTIONS.find(c => c.value === formData.woodworkDoorCount)?.label || '';
      items.push({ label: '도어 상세', value: `${doorTypesLabel} (${doorCountLabel})`, step: 12 });
    }
    if (formData.woodworkTypes.includes('inner-door')) {
      const innerDoorCountLabel = DOOR_COUNT_OPTIONS.find(c => c.value === formData.woodworkInnerDoorCount)?.label || '';
      items.push({ label: '중문 갯수', value: innerDoorCountLabel, step: 12 });
    }
    if (formData.woodworkTypes.includes('ceiling')) {
      const ceilingTypesLabel = formData.woodworkCeilingTypes
        .map(type => CEILING_TYPE_OPTIONS.find(t => t.value === type)?.label)
        .filter(Boolean)
        .join(', ');
      items.push({ label: '천장 철거', value: ceilingTypesLabel, step: 12 });
    }
    if (formData.woodworkOther) {
      items.push({ label: '목공 기타', value: formData.woodworkOther, step: 12 });
    }
  }

  // 기타 요청사항
  if (formData.additionalRequest) {
    items.push({ label: '기타 요청사항', value: formData.additionalRequest, step: 13 });
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
