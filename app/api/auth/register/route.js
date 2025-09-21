export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Appel au User Service
    const response = await fetch(`${process.env.USER_SERVICE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json({ message: error.message || "Erreur d'inscription" }, { status: 400 })
    }

    const user = await response.json()

    // Connexion automatique après inscription
    const loginResponse = await fetch(`${process.env.USER_SERVICE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      return Response.json({ token: loginData.token, user })
    }

    return Response.json({ user })
  } catch (error) {
    console.error("Erreur register:", error)
    return Response.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
