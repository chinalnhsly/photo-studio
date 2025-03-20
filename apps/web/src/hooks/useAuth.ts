import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return {
    isAuthenticated,
    login: (token: string) => {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    },
    logout: () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };
}
