import { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  birthdate: string;
  accounts: {
    Cash: number;
    Gcash: number;
    Debit_Card: number;
    Credit_Card: number;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const defaultUser = {
  id: 1,
  firstName: "Shean Benedict",
  lastName: "Arbon",
  birthdate: "2005-08-23",
  accounts: {
    Cash: 1000,
    Gcash: 500,
    Debit_Card: 2500,
    Credit_Card: 0
  }
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {}
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// Helper function to simulate fetching user data
export const fetchUserData = async (userId: number): Promise<User> => {
  // In production, this would make an API call to your backend
  // For demo purposes, we're returning mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(defaultUser);
    }, 500);
  });
};