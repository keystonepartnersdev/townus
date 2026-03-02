import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Award, Calculator, Shield, CheckCircle } from 'lucide-react';

const WhyHow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const whyCards = [];

  const howCards = [
    {
      type: 'how',
      icon: <Award size={32} className="text-white" />,
      title: "검증된전문기술력",
      subtitle: "20년+경력의 대기업공식협력팀",
      details: [
        "한샘,리바트등 대기업공식협력사",
        "안전관리자상주, 전문기술자팀구성",
        "시공이후까지 고려한정밀해체",
        "벽체·배관·전기구조손상최소화"
      ],
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      type: 'how',
      icon: <Calculator size={32} className="text-white" />,
      title: "투명한가격시스템",
      subtitle: "품목별표준단가로 명확한계산",
      details: [
        "인력단위견적 X → 품목별단가 O",
        "벽체·천장·바닥 ㎡당명확한단가",
        "배관m당, 폐기물ton당 투명공개",
        "숨겨진비용없음, 추가청구사전공지"
      ],
      bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    },
    {
      type: 'how',
      icon: <Shield size={32} className="text-white" />,
      title: "적법한폐기물처리",
      subtitle: "정식허가업체로 법적기준완벽준수",
      details: [
        "폐기물수집·운반 정식허가업체",
        "모든폐기물 적법절차로처리",
        "환경규제완벽준수로 고객보호",
        "처리증명서및 관련서류제공"
      ],
      bgColor: 'bg-gradient-to-br from-slate-500 to-slate-600'
    }
  ];

  const allSlides = [...whyCards, ...howCards];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allSlides.length);
  };

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000); // 4초마다 자동 슬라이드
    return () => clearInterval(timer);
  }, []);

  const currentItem = allSlides[currentSlide];

  return (
    <section 
      id="why-how" 
      className="py-20 bg-white"
      style={{ 
        contain: 'layout style',
        transform: 'translateZ(0)',
        isolation: 'isolate'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
        
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1F2937' }}>
            <span className="block sm:hidden">왜 타운어스를<br />선택해야 할까요?</span>
            <span className="hidden sm:block">왜 타운어스를 선택해야 할까요?</span>
          </h2>
          <p className="text-lg text-gray-600">
            <span className="block sm:hidden">한샘, 리바트 같은 대기업들이<br />공식 파트너로 신뢰하는 이유를<br />알려드립니다</span>
            <span className="hidden sm:block">한샘, 리바트 같은 대기업들이 공식 파트너로 신뢰하는 이유를 알려드립니다</span>
          </p>
        </motion.div>

        {/* 슬라이더 컨테이너 */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl mx-4 md:mx-20">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="py-4"
              style={{ contain: 'layout' }}
            >

              {/* HOW 카드 */}
              {currentItem.type === 'how' && (
                <div className={`${currentItem.bgColor} text-white py-12 px-8 md:p-12 w-full rounded-2xl`}>
                  <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center h-full justify-items-center">
                    
                    {/* 왼쪽: 아이콘과 기본 정보 */}
                    <div className="text-center lg:text-left">
                      <div className="mb-6 flex justify-center lg:justify-start">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          {currentItem.icon}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">
                        {currentItem.title}
                      </h3>
                      <p className="text-lg font-medium mb-6 text-white/90">
                        {currentItem.subtitle}
                      </p>
                    </div>

                    {/* 오른쪽: 상세 특징 */}
                    <div>
                      <h4 className="font-bold mb-4 text-white/90 text-lg">
                        주요 특징
                      </h4>
                      <ul className="space-y-3">
                        {currentItem.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle size={16} className="text-white/80 mt-1 flex-shrink-0" />
                            <span className="text-white/90">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>

        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="flex justify-center gap-3 mt-6">
          {allSlides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all ${
                index === currentSlide 
                  ? 'w-8 h-3 bg-blue-500' 
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              } rounded-full`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyHow;