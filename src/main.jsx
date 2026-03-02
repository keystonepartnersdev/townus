import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/globals.css'
import './styles/application.css'
import Hero from './components/Hero.jsx'
import WhyHow from './components/WhyHow.jsx'
import What from './components/What.jsx'
import Process from './components/Process.jsx'
import Promo from './components/Promo.jsx'
import Testimonials from './components/Testimonials.jsx'
import Footer from './components/Footer.jsx'
import Navigation from './components/Navigation.jsx'
import ApplicationPage from './pages/ApplicationPage.jsx'

// Landing Page Component
function LandingPage() {
  return (
    <div>
      <Navigation />

      <main style={{ paddingTop: '64px' }}>
        <Hero />
        <WhyHow />
        <What />
        <Process />
        <Testimonials />
        <Promo />
      </main>

      <Footer />
    </div>
  );
}

// Main App with Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplicationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
