// "use client"

// import { createContext, useContext, useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { User } from "@/types"
// import { useToast } from "@/components/ui/use-toast"

// interface AuthContextType {
//   user: User | null
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<void>
//   register: (userName: string, email: string, password: string) => Promise<void>
//   logout: () => Promise<void>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     try {
//       const response = await fetch("/api/auth/me")
//       if (response.ok) {
//         const data = await response.json()
//         setUser(data.user)
//       }
//     } catch (error) {
//       console.error("Error checking auth status:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Login failed")
//       }

//       const data = await response.json()
//       setUser(data.user)
//       toast({
//         title: "Success",
//         description: "Logged in successfully",
//       })
//       router.push("/dashboard")
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Login failed",
//         variant: "destructive",
//       })
//       throw error
//     }
//   }

//   const register = async (userName: string, email: string, password: string) => {
//     try {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userName, email, password }),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Registration failed")
//       }

//       const data = await response.json()
//       setUser(data.user)
//       toast({
//         title: "Success",
//         description: "Registered successfully",
//       })
//       router.push("/dashboard")
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Registration failed",
//         variant: "destructive",
//       })
//       throw error
//     }
//   }

//   const logout = async () => {
//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//       })

//       if (!response.ok) {
//         throw new Error("Logout failed")
//       }

//       setUser(null)
//       toast({
//         title: "Success",
//         description: "Logged out successfully",
//       })
//       router.push("/login")
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to logout",
//         variant: "destructive",
//       })
//       throw error
//     }
//   }

//   const value = { user, isLoading, login, register, logout }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// } 