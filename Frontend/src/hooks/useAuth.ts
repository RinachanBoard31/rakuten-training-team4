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
    // try {
    //   const response = await Client.post<User>(
    //     `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    //   );
    //   if (response.status === 200) {
    //     setIsAuthenticated("1");
    //     localStorage.setItem('authFlag', JSON.stringify(response.data));
    //     setUser(response.data);
    //     localStorage.setItem('user', JSON.stringify(response.data));
    //   }
    // } catch (error) {
    //     //　エラー処理
    //     console.error(error);
    // }

    //  for testing ///////////
    setIsAuthenticated("1");
    localStorage.setItem('authFlag', "1");
    setUser({ username: username, password });
    localStorage.setItem('user', JSON.stringify({ username: username, password }));
    //////////////////////////
  };

  const logout = () => {
    setIsAuthenticated(null);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

    useEffect(() => {
        if (isAuthenticated) {
        Client.defaults.headers.common['Authorization'] = `Bearer ${isAuthenticated}`;
        } else {
        delete Client.defaults.headers.common['Authorization'];
        }
    }, [isAuthenticated]);

  return { isAuthenticated, user, login, logout };
};
