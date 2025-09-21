"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import ChatSidebar from "@/components/chat/ChatSidebar"
import ChatWindow from "@/components/chat/ChatWindow"
import { useWebSocket } from "@/hooks/useWebSocket"
import { useConversations } from "@/hooks/useConversations"

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState(null)
  const { conversations, loadConversations } = useConversations()
  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user, loadConversations])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        user={user}
        isConnected={isConnected}
      />
      <ChatWindow conversation={selectedConversation} user={user} socket={socket} isConnected={isConnected} />
    </div>
  )
}
