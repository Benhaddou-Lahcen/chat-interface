export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return Response.json({ message: "Token manquant" }, { status: 401 })
    }

    const formData = await request.formData()

    // Appel au File Service
    const response = await fetch(`${process.env.FILE_SERVICE_URL}/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      return Response.json({ message: "Erreur lors de l'upload du fichier" }, { status: 500 })
    }

    const fileData = await response.json()
    return Response.json(fileData)
  } catch (error) {
    console.error("Erreur upload fichier:", error)
    return Response.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
