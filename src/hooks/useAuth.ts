import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = storage.getLoggedIn();
    setIsLoggedIn(loggedIn);
    setLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    // Simple authentication - in production, this would be more secure
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      storage.setLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    storage.setLoggedIn(false);
  };

  return { isLoggedIn, login, logout, loading };
};