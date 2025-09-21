"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, Smile, Phone, Video, MoreVertical } from "lucide-react"
import { useMessages } from "@/hooks/useMessages"
import MessageBubble from "./MessageBubble"
import FileUpload from "./FileUpload"
import { toast } from "@/hooks/use-toast"

export default function ChatWindow({ conversation, user, socket, isConnected }) {
  const [message, setMessage] = useState("")
  const [showFileUpload, setShowFileUpload] = useState(false)
  const messagesEndRef = useRef(null)
  const { messages, sendMessage, loadMessages } = useMessages(conversation?.id)

  useEffect(() => {
    if (conversation) {
      loadMessages()
    }
  }, [conversation, loadMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (socket && conversation) {
      const handleNewMessage = (newMessage) => {
        if (newMessage.conversationId === conversation.id) {
          // Le message sera ajouté via le hook useMessages
        }
      }

      socket.on("newMessage", handleNewMessage)
      return () => socket.off("newMessage", handleNewMessage)
    }
  }, [socket, conversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !conversation) return

    try {
      await sendMessage(message.trim())
      setMessage("")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (file) => {
    try {
      // Logique d'upload de fichier via le File Service
      const formData = new FormData()
      formData.append("file", file)
      formData.append("conversationId", conversation.id)

      const response = await fetch("/api/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      if (response.ok) {
        const fileData = await response.json()
        await sendMessage("", "file", fileData)
        setShowFileUpload(false)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le fichier.",
        variant: "destructive",
      })
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Send className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
          <p className="text-sm">Choisissez une conversation pour commencer à chatter</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {conversation.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-card-foreground">{conversation.name}</h2>
              <p className="text-sm text-muted-foreground">
                {conversation.isOnline ? "En ligne" : `Vu ${conversation.lastSeen || "récemment"}`}
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === user.id} user={user} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowFileUpload(!showFileUpload)}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Tapez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            disabled={!isConnected}
          />
          <Button type="submit" disabled={!message.trim() || !isConnected}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {showFileUpload && <FileUpload onFileSelect={handleFileUpload} onClose={() => setShowFileUpload(false)} />}
      </div>
    </div>
  )
}
