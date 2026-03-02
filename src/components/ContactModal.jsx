import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

const ContactModal = ({ isOpen, onClose, title = "서비스 신청하기" }) => {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const validatePhone = (phone) => {
    // 숫자만 추출
    const digits = phone.replace(/\D/g, '');
    
    // 010, 011, 016, 017, 018, 019로 시작하는 11자리 또는 10자리 번호
    const phoneRegex = /^(010|011|016|017|018|019)\d{7,8}$/;
    
    return phoneRegex.test(digits);
  };

  const formatPhone = (phone) => {
    // 숫자만 추출
    const digits = phone.replace(/\D/g, '');
    
    // 010-1234-5678 형태로 포맷
    if (digits.length >= 11) {
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (digits.length >= 7) {
      return digits.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
    }
    return digits;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // 전화번호 유효성 검사
    if (!validatePhone(formData.phone)) {
      setMessage({ 
        type: 'error', 
        text: '❌ 올바른 휴대폰 번호를 입력해주세요. (010-1234-5678 형식)' 
      });
      setIsLoading(false);
      return;
    }

    // 폼 데이터 준비
    const submitData = {
      companyName: formData.company,
      managerName: formData.name,
      phoneNumber: formData.phone,
      timestamp: new Date().toLocaleString('ko-KR'),
      source: 'TownUs Website'
    };

    console.log('제출할 데이터:', submitData);

    try {
      console.log('제출할 데이터:', submitData);
      
      await fetch('https://script.google.com/macros/s/AKfycbzjmBGYQ1b_5Q1ScLm2YAEQDvtY5qi6lwV0vakcTlUgj21Lq7xXyhdQHa33dmBr_jZTQQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(submitData)
      });

      console.log('Google Sheets 전송 완료');
      
      setMessage({ 
        type: 'success', 
        text: '✅ 신청이 완료되었습니다. 곧 연락드리겠습니다.' 
      });
      setFormData({ company: '', name: '', phone: '' });
      
      // 2초 후 모달 닫기
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Form submission error:', error);
      setMessage({ 
        type: 'error', 
        text: '❌ 전송에 실패했습니다. 잠시 후 다시 시도해주세요.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // 전화번호 입력 시 자동 포맷팅 및 숫자만 허용
      const formatted = formatPhone(value);
      setFormData({
        ...formData,
        [name]: formatted
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* 모달 컨테이너 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={20} className="text-gray-500" />
              </button>

              {/* 헤더 */}
              <div className="p-6 pb-4">
                <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#1F2937' }}>
                  {title}
                </h2>
                <p className="text-center text-gray-600 text-sm">
                  정보를 입력하시면 빠른 시간 내에 연락드리겠습니다
                </p>
              </div>

              {/* 폼 */}
              <form onSubmit={handleSubmit} className="px-6 pb-6">
                <div className="space-y-4">
                  {/* 업체명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      업체명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                      placeholder="회사명을 입력해주세요"
                    />
                  </div>

                  {/* 담당자명 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      담당자명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                      placeholder="담당자명을 입력해주세요"
                    />
                  </div>

                  {/* 전화번호 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      전화번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      maxLength="13"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
                      placeholder="010-1234-5678"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      휴대폰 번호를 입력하시면 자동으로 포맷됩니다
                    </p>
                  </div>
                </div>

                {/* 메시지 표시 영역 */}
                {message.text && (
                  <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
                    message.type === 'success' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* 개인정보 동의 */}
                <div className="mt-4">
                  <label className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      개인정보 수집 및 이용에 동의합니다. 수집된 정보는 상담 목적으로만 사용되며, 상담 완료 후 안전하게 폐기됩니다.
                    </span>
                  </label>
                </div>

                {/* 제출 버튼 */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className={`w-full mt-6 py-4 text-white font-semibold rounded-xl transition-all duration-200 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      전송 중...
                    </div>
                  ) : (
                    '신청하기'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;