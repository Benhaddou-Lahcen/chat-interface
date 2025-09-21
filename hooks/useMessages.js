"use client"

import { useState, useCallback } from "react"

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const loadMessages = useCallback(async () => {
    if (!conversationId) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error)
    } finally {
      setLoading(false)
    }
  }, [conversationId])

  const sendMessage = useCallback(
    async (content, type = "text", fileData = null) => {
      if (!conversationId) return

      try {
        const token = localStorage.getItem("token")
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversationId,
            content,
            type,
            fileData,
          }),
        })

        if (response.ok) {
          const newMessage = await response.json()
          setMessages((prev) => [...prev, newMessage])
          return newMessage
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error)
        throw error
      }
    },
    [conversationId],
  )

  return {
    messages,
    loading,
    loadMessages,
    sendMessage,
  }
}
