import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const storedToken = localStorage.getItem('townus_token');
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(tokenToVerify);
      } else {
        localStorage.removeItem('townus_token');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('townus_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || '로그인에 실패했습니다.');
    }

    localStorage.setItem('townus_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || '회원가입에 실패했습니다.');
    }

    // 회원가입 후 자동 로그인
    await login(userData.phone, userData.password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('townus_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
