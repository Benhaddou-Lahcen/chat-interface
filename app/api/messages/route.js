export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const { conversationId, content, type, fileData } = await request.json()

    if (!token) {
      return Response.json({ message: "Token manquant" }, { status: 401 })
    }

    // Appel au Chat Service
    const response = await fetch(`${process.env.CHAT_SERVICE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ conversationId, content, type, fileData }),
    })

    if (!response.ok) {
      return Response.json({ message: "Erreur lors de l'envoi du message" }, { status: 500 })
    }

    const message = await response.json()
    return Response.json(message)
  } catch (error) {
    console.error("Erreur envoi message:", error)
    return Response.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
