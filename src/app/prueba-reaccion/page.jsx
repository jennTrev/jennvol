"use client"

import { useState } from "react"
import Navbar from "../componentes/navbar"
import { Play } from "lucide-react"

export default function PruebaReaccion() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-4xl font-bold mb-12 text-[#1E3A8A]">Prueba de Reacción</h1>

          <div className="flex justify-center mb-8">
            <p className="text-lg text-gray-700 max-w-2xl">
              Esta prueba mide tu tiempo de reacción. Cuando estés listo, presiona el botón de inicio y espera a que
              cambie de color. Reacciona lo más rápido posible cuando veas el cambio.
            </p>
          </div>

          <div className="flex justify-center items-center my-12">
            <button
              className={`w-48 h-48 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-300 ${
                isHovering ? "bg-[#4F85E5] scale-105 shadow-xl" : "bg-[#1E3A8A]"
              }`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              aria-label="Iniciar prueba de reacción"
            >
              <div className="flex flex-col items-center">
                <Play size={36} className="mb-2" />
                <span>Iniciar</span>
              </div>
            </button>
          </div>

          <div className="mt-8 text-gray-600">
            <h2 className="text-xl font-semibold mb-4 text-[#1E3A8A]">Instrucciones:</h2>
            <ol className="text-left max-w-2xl mx-auto space-y-2">
              <li>1. Presiona el botón "Iniciar" cuando estés listo.</li>
              <li>2. Espera a que el botón cambie de color (aparecerá en un momento aleatorio).</li>
              <li>3. Haz clic lo más rápido posible cuando veas el cambio.</li>
              <li>4. Tu tiempo de reacción se mostrará en pantalla.</li>
              <li>5. Puedes repetir la prueba varias veces para mejorar tu tiempo.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

