import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types.js';

interface AuthContextType {
  user: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (email: string, name?: string, avatarUrl?: string) => Promise<void>;
  logout: () => void;
}

const DEFAULT_USER: User = {
  id: 'user_alex_rivera',
  name: 'Alex Rivera',
  email: 'alex.rivera@nexus-ecommerce.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isEmailVerified: true,
  createdAt: '2026-01-15T08:00:00.000Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const login = async (email: string, name?: string, avatarUrl?: string) => {
    setUser({
      ...DEFAULT_USER,
      email,
      name: name || email.split('@')[0].replace('.', ' ').toUpperCase(),
      avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=00d2b4&color=fff`,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        setCurrentRole,
        switchRole: (r: UserRole) => setCurrentRole(r),
        isAuthenticated,
        login,
        logout,
      }}
    >
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
