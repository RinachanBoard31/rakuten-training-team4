import React, { createContext, ReactNode, useContext } from 'react'
import { User } from '../entity/User';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface AuthContextProps {
    isAuthenticated: string | null;
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, age: number, password: string) => Promise<void>;
  }


export const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: null,
    user: null,
    login: async () => {},
    logout: () => {},
    register: async () => {},
})

interface AuthProviderProps {
    children: ReactNode;
  }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};


interface PrivateRouteProps {
    element: JSX.Element;
}

export const PrivateRoute = ({element}: PrivateRouteProps) => {
    const { isAuthenticated } = useContext(AuthContext);
    
  return isAuthenticated ? element : <Navigate to="/login" />;
}