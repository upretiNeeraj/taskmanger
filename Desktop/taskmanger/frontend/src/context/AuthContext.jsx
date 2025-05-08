import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setLoading(false);
    setLoading(false);
  }, []);

  const register = async (userData) => {
    const { data } = await api.post('/users/register', userData);
    localStorage.setItem('token', data.token);
    setUser({ name: data.name, email: data.email });
  };

  const login = async (userData) => {
    const { data } = await api.post('/users/login', userData);
    localStorage.setItem('token', data.token);
    setUser({ name: data.name, email: data.email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
