import { getUser } from '@/api/auth.api';
import React, { useState } from 'react';
import { User } from 'sprova-types';

interface UserContext {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

const initialContext: UserContext = {
  user: null,
  onLogin: () => {},
  onLogout: () => {},
};

const UserContext = React.createContext<UserContext>(initialContext);

const UserProvider: React.FunctionComponent = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(getUser());

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user: currentUser,
        onLogin: handleLogin,
        onLogout: handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
