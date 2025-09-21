"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Check, CheckCheck, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MessageBubble({ message, isOwn, user }) {
  const formatTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: fr,
    })
  }

  const handleFileDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
    }
  }

  const renderMessageContent = () => {
    if (message.type === "file") {
      const fileData = message.fileData
      const isImage = fileData.mimeType?.startsWith("image/")

      return (
        <div className="space-y-2">
          {isImage ? (
            <img
              src={fileData.url || "/placeholder.svg"}
              alt={fileData.name}
              className="max-w-xs rounded-lg cursor-pointer"
              onClick={() => window.open(fileData.url, "_blank")}
            />
          ) : (
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">{fileData.name}</p>
                <p className="text-xs text-muted-foreground">{(fileData.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleFileDownload(fileData.url, fileData.name)}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
          {message.content && <p className="text-sm">{message.content}</p>}
        </div>
      )
    }

    return <p className="text-sm">{message.content}</p>
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} space-x-2`}>
      {!isOwn && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={message.sender?.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {message.sender?.name?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-1" : "order-2"}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwn ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground border"
          }`}
        >
          {renderMessageContent()}
        </div>

        <div className={`flex items-center space-x-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}>
          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
          {isOwn && (
            <div className="text-muted-foreground">
              {message.status === "sent" && <Check className="h-3 w-3" />}
              {message.status === "delivered" && <CheckCheck className="h-3 w-3" />}
              {message.status === "read" && <CheckCheck className="h-3 w-3 text-blue-500" />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
