import { motion } from 'framer-motion';
import { Building, Wrench, Trash2, Zap, Construction, Leaf } from 'lucide-react';

const What = () => {
  const services = [
    {
      icon: <Building size={32} className="text-blue-600" />,
      title: "건물 전체 / 부분 철거",
      description: "아파트, 주택, 상가, 사무실 등 전체 규모 대응"
    },
    {
      icon: <Wrench size={32} className="text-blue-600" />,
      title: "인테리어 철거",
      description: "욕실, 주방, 벽체 등 부분적 철거 및 리모델링"
    },
    {
      icon: <Trash2 size={32} className="text-blue-600" />,
      title: "폐기물 처리",
      description: "현장 정리부터 적법한 폐기물 처리까지 원스톱"
    },
    {
      icon: <Zap size={32} className="text-blue-600" />,
      title: "긴급 철거",
      description: "응급 상황 대응, 24시간 신속 출동 서비스"
    },
    {
      icon: <Construction size={32} className="text-blue-600" />,
      title: "대형 구조물 철거",
      description: "공장, 창고, 대형 건물 등 전문 장비 동원"
    },
    {
      icon: <Leaf size={32} className="text-blue-600" />,
      title: "친환경 철거",
      description: "재활용 극대화, 환경 친화적 해체 및 처리"
    }
  ];

  return (
    <section id="what" className="section" style={{ backgroundColor: '#F9FAFB' }}>
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
            <span className="block sm:hidden">우리가 제공하는<br />서비스</span>
            <span className="hidden sm:block">우리가 제공하는 서비스</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            <span className="block sm:hidden">전문적이고 체계적인 철거 서비스로<br />안전하고 깨끗한 공간을 만들어드립니다</span>
            <span className="hidden sm:block">전문적이고 체계적인 철거 서비스로 안전하고 깨끗한 공간을 만들어드립니다</span>
          </p>
        </motion.div>

        {/* 서비스 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              {/* 아이콘 */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                  {service.icon}
                </div>
              </div>

              {/* 제목 */}
              <h3 
                className="text-xl font-semibold mb-4 text-center leading-tight"
                style={{ color: '#1F2937' }}
              >
                {service.title}
              </h3>

              {/* 설명 */}
              <p 
                className="text-sm leading-relaxed text-center text-gray-600"
              >
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default What;