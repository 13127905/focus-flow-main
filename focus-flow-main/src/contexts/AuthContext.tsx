import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, setCurrentUser, logout as logoutStorage, validateUser, registerUser } from '@/lib/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUsername(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (user: string, password: string): boolean => {
    if (validateUser(user, password)) {
      setCurrentUser(user);
      setUsername(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = (user: string, password: string): boolean => {
    if (registerUser(user, password)) {
      setCurrentUser(user);
      setUsername(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    logoutStorage();
    setUsername(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
