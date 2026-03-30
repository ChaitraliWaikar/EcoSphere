/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'individual', 'organization'
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }
    setLoading(false);
  }, []);

  const login = (userData, userTypeVal, tokenVal) => {
    setUser(userData);
    setUserType(userTypeVal);
    setToken(tokenVal);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', userTypeVal);
    localStorage.setItem('token', tokenVal);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setToken(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, userType, loading, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
