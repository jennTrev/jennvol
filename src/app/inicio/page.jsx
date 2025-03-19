"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "../componentes/navbar"

const API_URL = "https://reactvolt.onrender.com"

export default function Inicio() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId")

      if (!userId) {
        router.push("/")
        return
      }

      try {
        const response = await fetch(`${API_URL}/usuarios/${userId}`)

        if (!response.ok) {
          throw new Error("No se pudo obtener la información del usuario")
        }

        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userId")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => router.push("/")} className="px-4 py-2 bg-[#E12836] text-white rounded">
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">
            Bienvenido, {user?.nombre} {user?.apellido}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Información del usuario</h2>
              <p>
                <span className="font-medium">Usuario:</span> {user?.user}
              </p>
              <p>
                <span className="font-medium">Correo:</span> {user?.correo}
              </p>
              <p>
                <span className="font-medium">Rol:</span> {user?.rol}
              </p>

              {user?.rol === "jugador" && (
                <>
                  <p>
                    <span className="font-medium">Altura:</span> {user?.altura} m
                  </p>
                  <p>
                    <span className="font-medium">Posición:</span> {user?.posicion}
                  </p>
                  <p>
                    <span className="font-medium">Fecha de nacimiento:</span> {user?.fecha_nacimiento}
                  </p>
                </>
              )}
            </div>
          </div>

          <button onClick={handleLogout} className="px-4 py-2 bg-[#E12836] text-white rounded">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

