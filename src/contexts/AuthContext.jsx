import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      if (!foundUser.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Update last login
      foundUser.lastLogin = new Date().toISOString();
      localStorage.setItem('users', JSON.stringify(users));

      // Create session data
      const sessionData = {
        userId: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        userType: foundUser.userType,
        loginTime: new Date().toISOString(),
      };

      // Store session
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
      }

      setUser(sessionData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.find(user => user.email === userData.email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};