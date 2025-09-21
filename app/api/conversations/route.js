export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return Response.json({ message: "Token manquant" }, { status: 401 })
    }

    // Appel au Chat Service
    const response = await fetch(`${process.env.CHAT_SERVICE_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return Response.json({ message: "Erreur lors du chargement des conversations" }, { status: 500 })
    }

    const conversations = await response.json()
    return Response.json(conversations)
  } catch (error) {
    console.error("Erreur conversations:", error)
    return Response.json({ message: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const { participantIds, name } = await request.json()

    if (!token) {
      return Response.json({ message: "Token manquant" }, { status: 401 })
    }

    // Appel au Chat Service
    const response = await fetch(`${process.env.CHAT_SERVICE_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ participantIds, name }),
    })

    if (!response.ok) {
      return Response.json({ message: "Erreur lors de la création de la conversation" }, { status: 500 })
    }

    const conversation = await response.json()
    return Response.json(conversation)
  } catch (error) {
    console.error("Erreur création conversation:", error)
    return Response.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
