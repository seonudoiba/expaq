import  { createContext, useState, useContext, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";


interface User {
	sub: string;
	roles: string;
}

interface AuthContextType {
	user: User | null;
	handleLogin: (token: string) => void;
	handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  handleLogin: (token: string) => {},
  handleLogout: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (token: string) => {
    const decodedUser: User = jwtDecode(token);
    localStorage.setItem("userId", decodedUser.sub);
    localStorage.setItem("userRole", decodedUser.roles);
    localStorage.setItem("token", token);
    setUser(decodedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
