"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export default function ChatSidebar({ conversations, selectedConversation, onSelectConversation, user, isConnected }) {
  const [searchTerm, setSearchTerm] = useState("")
  const { logout } = useAuth()

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                {user?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-sidebar-foreground">{user?.name}</h2>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-xs text-sidebar-foreground/70">{isConnected ? "En ligne" : "Hors ligne"}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-sidebar-accent border-sidebar-border"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-sidebar-foreground/50">
            <MessageCircle className="h-12 w-12 mb-2" />
            <p className="text-sm">Aucune conversation</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-sidebar-border cursor-pointer hover:bg-sidebar-accent transition-colors ${
                selectedConversation?.id === conversation.id ? "bg-sidebar-accent" : ""
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                      {conversation.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-sidebar" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sidebar-foreground truncate">{conversation.name}</h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-sidebar-foreground/50">
                        {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-sidebar-foreground/70 truncate">
                      {conversation.lastMessage?.content || "Aucun message"}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-sidebar-accent text-sidebar-accent-foreground">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
