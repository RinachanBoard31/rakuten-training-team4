// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { User } from '../entity/User.ts';
import Client from '../api/client.ts';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const authFlag = localStorage.getItem('authFlag');
    return authFlag ? authFlag : null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedEmployee = localStorage.getItem('employee');
    return storedEmployee ? JSON.parse(storedEmployee) : null;
  });

  const login = async (username: string, password: string) => {
    const response = await Client.post('/items/login/', { username, password });
      if (response.status === 200) {
        setIsAuthenticated("1");
        localStorage.setItem('authFlag', "1");
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
  };

  const logout = () => {
    setIsAuthenticated(null);
    localStorage.removeItem('authFlag');
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (username: string, email: string, age: number, password: string) => {
    try {
      const response = await Client.post('/items/register/', { username, email, age, password });
      if (response.status === 201) {
        setIsAuthenticated("1");
        localStorage.setItem('authFlag', "1");
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error during registeration: ", error);
      throw error;
    }
  };

    useEffect(() => {
        if (isAuthenticated) {
        Client.defaults.headers.common['Authorization'] = `Bearer ${isAuthenticated}`;
        } else {
        delete Client.defaults.headers.common['Authorization'];
        }
    }, [isAuthenticated]);

  return { isAuthenticated, user, login, logout, register };
};
