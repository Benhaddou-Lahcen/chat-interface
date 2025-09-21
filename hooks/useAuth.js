"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.USER_SERVICE_URL || "http://localhost:3001"}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error)
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await fetch(`${process.env.USER_SERVICE_URL || "http://localhost:3001"}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Erreur de connexion")
    }

    const data = await response.json()
    localStorage.setItem("token", data.token)
    setUser(data.user)

    // Démarrer le heartbeat
    startHeartbeat()

    return data
  }

  const register = async (name, email, password) => {
    const response = await fetch(`${process.env.USER_SERVICE_URL || "http://localhost:3001"}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Erreur d'inscription")
    }

    const data = await response.json()
    localStorage.setItem("token", data.token)
    setUser(data.user)

    // Démarrer le heartbeat
    startHeartbeat()

    return data
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token && user) {
        await fetch(`${process.env.USER_SERVICE_URL || "http://localhost:3001"}/auth/logout/${user.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
      stopHeartbeat()
    }
  }

  const startHeartbeat = () => {
    if (user) {
      const interval = setInterval(async () => {
        try {
          const token = localStorage.getItem("token")
          if (token && user) {
            await fetch(`${process.env.USER_SERVICE_URL || "http://localhost:3001"}/auth/heartbeat/${user.id}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          }
        } catch (error) {
          console.error("Erreur heartbeat:", error)
        }
      }, 30000) // Toutes les 30 secondes

      return () => clearInterval(interval)
    }
  }

  const stopHeartbeat = () => {
    // Le cleanup sera géré par le useEffect
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
