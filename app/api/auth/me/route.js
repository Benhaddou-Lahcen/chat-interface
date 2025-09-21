export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return Response.json({ message: "Token manquant" }, { status: 401 })
    }

    // Vérifier le token avec le User Service
    const response = await fetch(`${process.env.USER_SERVICE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return Response.json({ message: "Token invalide" }, { status: 401 })
    }

    const user = await response.json()
    return Response.json(user)
  } catch (error) {
    console.error("Erreur me:", error)
    return Response.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
