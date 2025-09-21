export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Appel au User Service
    const response = await fetch(`${process.env.USER_SERVICE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json({ message: error.message || "Erreur de connexion" }, { status: 401 })
    }

    const data = await response.json()

    // Récupérer les informations utilisateur
    const userResponse = await fetch(`${process.env.USER_SERVICE_URL}/users/${data.userId}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })

    if (userResponse.ok) {
      const user = await userResponse.json()
      return Response.json({ token: data.token, user })
    }

    return Response.json({ token: data.token, message: data.message })
  } catch (error) {
    console.error("Erreur login:", error)
    return Response.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
