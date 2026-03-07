import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './styles/globals.css'
import './styles/application.css'
import './styles/admin.css'
import './styles/auth.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Hero from './components/Hero.jsx'
import WhyHow from './components/WhyHow.jsx'
import What from './components/What.jsx'
import Process from './components/Process.jsx'
import Promo from './components/Promo.jsx'
import Testimonials from './components/Testimonials.jsx'
import Footer from './components/Footer.jsx'
import Navigation from './components/Navigation.jsx'
import ApplicationPage from './pages/ApplicationPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import MypagePage from './pages/MypagePage.jsx'
import { useAuth } from './contexts/AuthContext.jsx'

// Landing Page Component - 로그인 시 대시보드로 리다이렉트
function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/mypage', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // 리다이렉트 중
  }

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
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<ApplicationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/mypage" element={<MypagePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
