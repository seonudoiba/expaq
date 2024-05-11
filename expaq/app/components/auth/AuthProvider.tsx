// import { useCallback, useState } from "react";
// // ...

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   const handleLogin = useCallback((token: string) => {
//     const decodedUser: User = jwtDecode(token);
//     console.log("Hey", decodedUser);
//     localStorage.setItem("userId", decodedUser.sub);
//     localStorage.setItem("userRole", decodedUser.roles);
//     localStorage.setItem("token", token);
//     setUser(decodedUser);
//   }, [setUser]);

//   const handleLogout = useCallback(() => {
//     localStorage.removeItem("userId");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("token");
//     setUser(null);
//   }, [setUser]);

//   return (
//     <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };