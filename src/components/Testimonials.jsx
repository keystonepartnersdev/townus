import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      rating: 4.5,
      text: "벽체 손상 하나 없이 깔끔하게 철거해주셔서 바로 시공에 들어갔어요. 예상 비용과 정확히 일치해서 깜짝 놀랐습니다. 다른 업체는 추가비용이 20만원이나 나왔는데 타운어스는 계약서 그대로였어요.",
      customer: "김○○",
      details: "시공면적: 85㎡ | 2024년 5월"
    },
    {
      rating: 4,
      text: "소음 때문에 이웃사람들이 걱정했는데, 전문적인 공법으로 빠르고 조용하게 진행되었습니다. 폐기물 처리도 깔끔했어요! 오전 9시부터 오후 4시까지 연속 작업이 가능해서 하루 만에 끝났습니다.",
      customer: "이○○",
      details: "시공면적: 40㎡ | 2024년 6월"
    },
    {
      rating: 4.5,
      text: "처음엔 인테리어 업체를 통해 알게 됐는데, 직접 계약하니까 더 싸더라고요. 투명하고 신뢰감 있는 서비스입니다. 욕실과 주방만 철거했는데 배관 연결부까지 깔끔하게 정리해주셨어요.",
      customer: "박○○",
      details: "시공면적: 20㎡ | 2024년 7월"
    },
    {
      rating: 5,
      text: "배관과 전기를 정밀하게 철거해주셔서 다음 시공 비용이 생각보다 많이 절감됐어요. 추천합니다! 특히 전기 배선을 새로 할 때 기존 선로를 활용할 수 있게 해주셔서 전기공사비가 50만원이나 줄었어요.",
      customer: "최○○",
      details: "시공면적: 120㎡ | 2024년 8월"
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);


  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);

    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [emblaApi, onInit, onSelect]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const isFilled = i < Math.floor(rating);
      const isHalfFilled = i === Math.floor(rating) && rating % 1 !== 0;
      
      if (isFilled) {
        return (
          <Star
            key={i}
            size={16}
            className="text-yellow-400 fill-yellow-400"
          />
        );
      } else if (isHalfFilled) {
        return (
          <div key={i} className="relative inline-block">
            <Star size={16} className="text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      } else {
        return (
          <Star
            key={i}
            size={16}
            className="text-gray-300"
          />
        );
      }
    });
  };

  return (
    <section id="testimonials" className="section" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#1F2937' }}>
            <span className="block sm:hidden">타운어스를 경험한<br />고객들의 목소리</span>
            <span className="hidden sm:block">타운어스를 경험한 고객들의 목소리</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            <span className="block sm:hidden">이미 500+ 업체가 선택한<br />신뢰할 수 있는 철거 서비스</span>
            <span className="hidden sm:block">이미 500+ 업체가 선택한 신뢰할 수 있는 철거 서비스</span>
          </p>
        </motion.div>

        {/* 캐러셀 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 flex justify-center"
                >
                  <motion.div
                    whileHover={{
                      y: -4,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3 }
                    }}
                    className="mx-2 rounded-xl p-6 shadow-sm border border-gray-200 h-full transition-all duration-300 w-full max-w-sm"
                    style={{
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    {/* 별점 */}
                    <div className="flex mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* 후기 텍스트 */}
                    <p 
                      className="text-[15px] mb-6"
                      style={{ 
                        color: '#4B5563',
                        lineHeight: '1.6'
                      }}
                    >
                      "{testimonial.text}"
                    </p>

                    {/* 고객 정보 */}
                    <div className="border-t border-gray-200 pt-4">
                      <div 
                        className="font-medium mb-1"
                        style={{ color: '#1A3A52' }}
                      >
                        {testimonial.customer}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: '#6B7280' }}
                      >
                        {testimonial.details}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>

        {/* 페이지네이션 닷 */}
        <div className="flex justify-center gap-3 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all ${
                index === selectedIndex
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

export default Testimonials;