"use client"

import { useState, useCallback } from "react"

export function useConversations() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)

  const loadConversations = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des conversations:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const createConversation = useCallback(async (participantIds, name) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ participantIds, name }),
      })

      if (response.ok) {
        const newConversation = await response.json()
        setConversations((prev) => [newConversation, ...prev])
        return newConversation
      }
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
      throw error
    }
  }, [])

  return {
    conversations,
    loading,
    loadConversations,
    createConversation,
  }
}
