import { useState } from 'react';

export function useContactModal() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("서비스 신청하기");

  const openModal = (title = "서비스 신청하기") => {
    setModalTitle(title);
    setIsContactModalOpen(true);
  };

  const closeModal = () => {
    setIsContactModalOpen(false);
  };

  return {
    isContactModalOpen,
    modalTitle,
    openModal,
    closeModal
  };
}