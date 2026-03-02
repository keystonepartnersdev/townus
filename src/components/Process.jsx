import { motion } from 'framer-motion';
import { Phone, MessageSquare, Search, ClipboardList, DollarSign, FileText, Calendar, Wrench, Trash2 } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      step: 1,
      title: "무료 현장 상담",
      details: [
        { icon: <Phone size={16} />, text: "전화 / 카톡 상담 신청" },
        { icon: <Search size={16} />, text: "현장 방문 (또는 사진 기반 상담)" }
      ],
      time: "소요 시간: 15~30분"
    },
    {
      step: 2,
      title: "정확한 견적 제공",
      details: [
        { icon: <ClipboardList size={16} />, text: "현장 측정 및 분석" },
        { icon: <DollarSign size={16} />, text: "투명한 표준 단가 견적서 제공" }
      ],
      time: "소요 시간: 당일~1일"
    },
    {
      step: 3,
      title: "계약 및 일정 조율",
      details: [
        { icon: <FileText size={16} />, text: "계약서 작성 (추가비용 없음)" },
        { icon: <Calendar size={16} />, text: "작업 일정 협의 및 확정" }
      ],
      time: "소요 시간: 1~2일"
    },
    {
      step: 4,
      title: "전문 철거 시공",
      details: [
        { icon: <Wrench size={16} />, text: "전문 장비를 활용한 안전 철거" },
        { icon: <Trash2 size={16} />, text: "현장 정리 및 폐기물 처리" }
      ],
      time: "소요 시간: 1~3일"
    }
  ];

  return (
    <section id="process" className="section bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1F2937' }}>
            <span className="block sm:hidden">이렇게<br />진행됩니다</span>
            <span className="hidden sm:block">이렇게 진행됩니다</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            <span className="block sm:hidden">상담부터 완료까지,<br />체계적이고 투명한 4단계 프로세스</span>
            <span className="hidden sm:block">상담부터 완료까지, 체계적이고 투명한 4단계 프로세스</span>
          </p>
        </motion.div>

        {/* 타임라인 */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* 연결선 */}
            <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gray-300 hidden md:block"></div>
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                className="relative flex items-start mb-12 last:mb-0"
              >
                {/* 단계 번호 */}
                <motion.div
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-2xl z-10 relative"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  {step.step}
                </motion.div>

                {/* 스텝 카드 */}
                <motion.div
                  whileHover={{ 
                    y: -4,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    transition: { duration: 0.2 }
                  }}
                  className="ml-5 bg-white border border-gray-200 rounded-xl p-6 flex-1 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* 타이틀 */}
                  <h3 
                    className="text-lg font-semibold mb-md"
                    style={{ color: '#1A3A52' }}
                  >
                    {step.title}
                  </h3>

                  {/* 상세 내용 */}
                  <div className="space-y-sm mb-md">
                    {step.details.map((detail, detailIndex) => (
                      <div
                        key={detailIndex}
                        className="text-sm flex items-center"
                        style={{ color: '#4B5563' }}
                      >
                        <span className="mr-3 text-blue-500">{detail.icon}</span>
                        <span>{detail.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* 소요 시간 */}
                  <div 
                    className="text-xs font-bold inline-block px-3 py-1 rounded-full"
                    style={{ 
                      color: '#2563EB',
                      backgroundColor: '#EBF4FF'
                    }}
                  >
                    {step.time}
                  </div>
                </motion.div>

                {/* 호버 시 연결선 색상 변화 */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="absolute left-6 top-12 w-0.5 h-24 bg-gray-300 hidden md:block"
                    whileHover={{ backgroundColor: '#2563EB' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Process;