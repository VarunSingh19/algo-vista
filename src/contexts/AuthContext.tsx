
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import apiClient from "@/lib/api"

// Define types
export interface User {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  avatarUrl: string
  location: string
  bio: string
  socialLinks: {
    github: string
    twitter: string
    linkedin: string
    personalSite: string
  }
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isLoading: boolean // Compatibility
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  registerWithOTP: (name: string, email: string, password: string, otp: string) => Promise<User>
  sendOTP: (email: string, name: string) => Promise<void>
  verifyOTP: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
  mergeGuestProgress: () => Promise<void>
  setUser: (user: User | null) => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch current user on initial load
  useEffect(() => {
    console.log("Auth context initialized")
    const fetchUser = async () => {
      try {
        console.log("Fetching current user...")
        const { data } = await apiClient.getCurrentUser()
        console.log("User data fetched:", data)
        setUser(data)
      } catch (err) {
        console.log("User not authenticated or fetch error")
        // User is not authenticated, that's okay
        setUser(null)
      } finally {
        console.log("Auth loading complete")
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.login({ email, password })
      setUser(data.user)
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Legacy register function (for backward compatibility)
  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.register({ name, email, password })
      setUser(data.user)
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Send OTP function
  const sendOTP = async (email: string, name: string) => {
    setError(null)

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
      throw err
    }
  }

  // Verify OTP function
  const verifyOTP = async (email: string, otp: string) => {
    setError(null)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "OTP verification failed")
      }
    } catch (err: any) {
      setError(err.message || "OTP verification failed")
      throw err
    }
  }

  // Register with OTP function
  const registerWithOTP = async (name: string, email: string, password: string, otp: string): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setUser(data.user)
      return data.user
    } catch (err: any) {
      setError(err.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)
    setError(null)

    try {
      await apiClient.logout()
      setUser(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Logout failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.updateUser(userData)
      setUser(data)
    } catch (err: any) {
      setError(err.response?.data?.error || "Update failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Merge guest progress
  const mergeGuestProgress = async () => {
    if (!user) return

    // Check localStorage for guest progress
    const localStorageKeys = Object.keys(localStorage)
    const progressKeys = localStorageKeys.filter((key) => key.startsWith("progress:"))

    // For each sheet with guest progress
    for (const key of progressKeys) {
      try {
        // Get sheet ID from key
        const sheetId = key.split(":")[1]

        // Get completed problems
        const completedProblems = JSON.parse(localStorage.getItem(key) || "[]")

        // For each completed problem, toggle in the database
        for (const problemId of completedProblems) {
          await apiClient.toggleProblem({ sheetId, problemId })
        }

        // Clear localStorage after merging
        localStorage.removeItem(key)
      } catch (error) {
        console.error("Error merging guest progress:", error)
      }
    }
  }

  const contextValue: AuthContextType = {
    user,
    loading,
    isLoading: loading, // For backwards compatibility
    error,
    login,
    register, // Legacy function
    registerWithOTP, // New OTP-based registration
    sendOTP,
    verifyOTP,
    logout,
    updateUser,
    mergeGuestProgress,
    setUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
