import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import Hero from './components/Hero.jsx'
import WhyHow from './components/WhyHow.jsx'
import What from './components/What.jsx'
import Process from './components/Process.jsx'
import Promo from './components/Promo.jsx'
import Testimonials from './components/Testimonials.jsx'
import Footer from './components/Footer.jsx'
import ContactModal from './components/ContactModal.jsx'
import Navigation from './components/Navigation.jsx'
import { useContactModal } from './hooks/useContactModal.js'

// Clean production version
export function App() {
  const { isContactModalOpen, modalTitle, openModal, closeModal } = useContactModal();

  return (
    <div>
      <Navigation openModal={openModal} />
      
      <main style={{ paddingTop: '64px' }}>
        <Hero openModal={openModal} />
        <WhyHow />
        <What />
        <Process />
        <Testimonials />
        <Promo openModal={openModal} />
      </main>
      
      <Footer />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={closeModal}
        title={modalTitle}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
