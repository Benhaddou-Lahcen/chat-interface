import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata = {
  title: "ChatApp - Messagerie instantanée",
  description: "Application de chat en temps réel comme WhatsApp",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

