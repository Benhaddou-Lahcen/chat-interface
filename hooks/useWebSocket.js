"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "./useAuth"
import io from "socket.io-client"

export function useWebSocket() {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    if (user && !socketRef.current) {
      const token = localStorage.getItem("token")

      const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080", {
        auth: {
          token: token,
        },
        transports: ["websocket"],
      })

      newSocket.on("connect", () => {
        console.log("WebSocket connecté")
        setIsConnected(true)
      })

      newSocket.on("disconnect", () => {
        console.log("WebSocket déconnecté")
        setIsConnected(false)
      })

      newSocket.on("error", (error) => {
        console.error("Erreur WebSocket:", error)
      })

      // Événements de présence
      newSocket.on("userOnline", (userData) => {
        console.log("Utilisateur en ligne:", userData)
      })

      newSocket.on("userOffline", (userData) => {
        console.log("Utilisateur hors ligne:", userData)
      })

      socketRef.current = newSocket
      setSocket(newSocket)
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [user])

  return { socket, isConnected }
}
