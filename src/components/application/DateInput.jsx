import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DateInput = ({ question, value, onChange, placeholder = '날짜를 선택해주세요' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 오늘 기준 최소 7일 후부터 선택 가능
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 7);

  // 3개월 후까지만 선택 가능
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 외부 클릭 감지 (mouse + touch) - 모바일은 backdrop이 처리
  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile]);

  // 달력 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[d.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // 이전 달의 빈 칸
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    return date < minDate || date > maxDate;
  };

  const isDateSelected = (date) => {
    if (!date || !value) return false;
    const selected = new Date(value);
    return date.toDateString() === selected.toDateString();
  };

  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    onChange(date.toISOString());
    setIsOpen(false);
  };

  const goToPrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const canGoPrev = currentMonth > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext = currentMonth < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const days = getDaysInMonth(currentMonth);
  const monthLabel = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

  // 모바일용 애니메이션 (중앙 팝업 - x, y로 중앙 정렬 유지)
  const mobileVariants = {
    initial: { opacity: 0, scale: 0.9, x: '-50%', y: '-50%' },
    animate: { opacity: 1, scale: 1, x: '-50%', y: '-50%', transition: { type: 'spring', damping: 25, stiffness: 400 } },
    exit: { opacity: 0, scale: 0.9, x: '-50%', y: '-50%', transition: { duration: 0.15 } },
  };

  // 데스크톱용 애니메이션
  const desktopVariants = {
    initial: { opacity: 0, y: -8, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.12 } },
  };

  // 달력 UI (모바일/데스크톱 공통)
  const calendarContent = (
    <motion.div
      className="date-picker-dropdown"
      variants={isMobile ? mobileVariants : desktopVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      role="dialog"
      aria-modal="true"
      aria-label="날짜 선택 달력"
    >
      <div className="date-picker-header">
        <button
          type="button"
          className="month-nav-btn"
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          aria-label="이전 달"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <span className="month-label">{monthLabel}</span>
        <button
          type="button"
          className="month-nav-btn"
          onClick={goToNextMonth}
          disabled={!canGoNext}
          aria-label="다음 달"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9,6 15,12 9,18" />
          </svg>
        </button>
      </div>

      <div className="date-picker-weekdays" role="row">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <span key={day} className="weekday" role="columnheader">{day}</span>
        ))}
      </div>

      <div className="date-picker-days" role="grid">
        {days.map((date, index) => (
          <button
            key={index}
            type="button"
            className={`day-btn ${!date ? 'empty' : ''} ${date && isDateDisabled(date) ? 'disabled' : ''} ${date && isDateSelected(date) ? 'selected' : ''}`}
            onClick={() => date && handleDateSelect(date)}
            disabled={!date || isDateDisabled(date)}
            aria-label={date ? `${date.getMonth() + 1}월 ${date.getDate()}일` : undefined}
            aria-selected={date ? isDateSelected(date) : undefined}
          >
            {date ? date.getDate() : ''}
          </button>
        ))}
      </div>

      <p className="date-picker-hint">
        * 최소 7일 후부터 선택 가능합니다
      </p>
    </motion.div>
  );

  return (
    <div className="date-input-container">
      <motion.h1
        className="step-question"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ whiteSpace: 'pre-line' }}
      >
        {question}
      </motion.h1>

      <motion.div
        className="date-input-wrapper"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <button
          ref={triggerRef}
          type="button"
          className={`date-input-trigger ${value ? 'has-value' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={value ? `선택된 날짜: ${formatDate(value)}` : '날짜 선택'}
        >
          <span className={value ? 'date-value' : 'date-placeholder'}>
            {value ? formatDate(value) : placeholder}
          </span>
          <svg
            className="calendar-icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>

        {/* 데스크톱: wrapper 내부에 드롭다운 렌더링 */}
        {!isMobile && (
          <AnimatePresence>
            {isOpen && (
              <div ref={containerRef}>
                {calendarContent}
              </div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* 모바일: body에 포털로 렌더링 - AnimatePresence 분리 */}
      {isMobile && createPortal(
        <>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="date-picker-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(false)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isOpen && calendarContent}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
};

export default DateInput;
