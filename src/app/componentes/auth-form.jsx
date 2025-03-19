"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// Actualizar la URL de la API para asegurar que sea correcta
const API_URL = "https://reactvolt.onrender.com"

export default function AuthForm() {
  const router = useRouter()
  const [formType, setFormType] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Estado del formulario de inicio de sesión
  const [loginData, setLoginData] = useState({
    user: "",
    password: "",
  })

  // Estado del formulario de registro
  const [registerData, setRegisterData] = useState({
    nombre: "",
    apellido: "",
    user: "",
    contrasena: "",
    rol: "jugador", // Rol predeterminado
    correo: "",
    altura: "",
    posicion: "",
    fecha_nacimiento: "",
  })

  // Manejar cambios en el formulario de inicio de sesión
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData({
      ...loginData,
      [name]: value,
    })
  }

  // Manejar cambios en el formulario de registro
  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData({
      ...registerData,
      [name]: value,
    })
  }

  // Manejar envío del formulario de inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: loginData.user,
          password: loginData.password,
        }),
      })

      // Verificar si la respuesta es correcta antes de intentar analizar JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Error al iniciar sesión")
        } else {
          // Si no es JSON, obtener texto y lanzar error
          const errorText = await response.text()
          console.error("Respuesta del servidor:", errorText)
          throw new Error("Error de conexión con el servidor")
        }
      }

      // Intentar analizar la respuesta JSON
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("Error al analizar JSON:", parseError)
        throw new Error("Error al procesar la respuesta del servidor")
      }

      // Almacenar ID de usuario en localStorage
      localStorage.setItem("userId", data.userId)

      // Obtener el rol del usuario para determinar la ruta de redirección
      try {
        const userResponse = await fetch(`${API_URL}/usuarios/${data.userId}`, {
          headers: {
            Accept: "application/json",
          },
        })

        if (!userResponse.ok) {
          throw new Error("No se pudo obtener información del usuario")
        }

        const userData = await userResponse.json()
        const userRole = userData.rol

        // Redireccionar según el rol del usuario
        if (userRole === "jugador") {
          router.push("/inicio")
        } else if (userRole === "entrenador") {
          router.push("/entrenador")
        } else if (userRole === "tecnico") {
          router.push("/tecnico")
        } else {
          // Redirección predeterminada
          router.push("/inicio")
        }
      } catch (roleError) {
        console.error("Error al obtener el rol del usuario:", roleError)
        // Redirección predeterminada si falla la verificación del rol
        router.push("/inicio")
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      setError(error.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  // Manejar envío del formulario de registro
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Crear objeto de usuario basado en el rol
      const userData = {
        nombre: registerData.nombre,
        apellido: registerData.apellido,
        user: registerData.user,
        contrasena: registerData.contrasena,
        rol: registerData.rol,
        correo: registerData.correo,
      }

      // Agregar campos adicionales si el rol es 'jugador'
      if (registerData.rol === "jugador") {
        userData.altura = Number.parseFloat(registerData.altura) || null
        userData.posicion = registerData.posicion
        userData.fecha_nacimiento = registerData.fecha_nacimiento
      }

      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      })

      // Verificar si la respuesta es correcta antes de intentar analizar JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar usuario")
        } else {
          // Si no es JSON, obtener texto y lanzar error
          const errorText = await response.text()
          console.error("Respuesta del servidor:", errorText)
          throw new Error("Error de conexión con el servidor")
        }
      }

      // Intentar analizar la respuesta JSON
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error("Error al analizar JSON:", parseError)
        throw new Error("Error al procesar la respuesta del servidor")
      }

      // Cambiar al formulario de inicio de sesión después del registro exitoso
      setFormType("login")
      setLoginData({
        user: registerData.user,
        password: "",
      })
    } catch (error) {
      console.error("Error de registro:", error)
      setError(error.message || "Error al registrar usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1434064511983-18c6dae20ed5?q=80&fm=jpg')" }}
    >
      <div className="w-[300px] h-[500px] bg-black/70 overflow-hidden relative shadow-lg">
        {/* Encabezado */}
        <div className="w-full bg-black/10">
          <h1 className="text-center py-2.5 font-light text-xl text-white/50">
            {formType === "login" && "Iniciar Sesión"}
            {formType === "register" && "Registro de Usuario"}
          </h1>
        </div>

        {/* Logo */}
        <div
          className={`relative mx-auto bg-center bg-no-repeat bg-cover transition-all duration-200 ease-in-out flex items-center justify-center
          ${formType === "login" ? "w-[150px] h-[150px] mt-[30px]" : ""}
          ${formType === "register" ? "w-[120px] h-[120px] mt-[10px]" : ""}
        `}
        >
          <div className="text-white text-4xl font-bold">ReactVolt</div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="absolute top-[180px] left-0 right-0 mx-auto text-center px-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Formularios */}
        <div className="absolute bottom-[50px] w-full">
          <AnimatePresence mode="wait">
            {formType === "login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
                onSubmit={handleLogin}
              >
                <input
                  type="text"
                  name="user"
                  placeholder="Usuario"
                  value={loginData.user}
                  onChange={handleLoginChange}
                  className="block w-[84%] mx-auto my-5 p-2.5 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-lg transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="block w-[84%] mx-auto my-5 p-2.5 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-lg transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="block w-[84%] mx-auto my-5 p-2.5 text-center bg-[#E12836] text-white rounded disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </button>
              </motion.form>
            )}

            {formType === "register" && (
              <motion.form
                key="register"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full overflow-y-auto max-h-[300px] pr-2"
                onSubmit={handleRegister}
              >
                {/* Selección de rol primero */}
                <div className="w-[84%] mx-auto my-3">
                  <label className="block text-white text-sm mb-1">Selecciona tu rol</label>
                  <select
                    name="rol"
                    value={registerData.rol}
                    onChange={handleRegisterChange}
                    className="w-full p-2 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-base transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                    required
                  >
                    <option value="jugador" className="bg-gray-800">
                      Jugador
                    </option>
                    <option value="entrenador" className="bg-gray-800">
                      Entrenador
                    </option>
                    <option value="tecnico" className="bg-gray-800">
                      Técnico
                    </option>
                  </select>
                </div>

                {/* Campos comunes para todos los roles */}
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={registerData.nombre}
                  onChange={handleRegisterChange}
                  className="block w-[84%] mx-auto my-3 p-2 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-base transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={registerData.apellido}
                  onChange={handleRegisterChange}
                  className="block w-[84%] mx-auto my-3 p-2 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-base transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="user"
                  placeholder="Usuario"
                  value={registerData.user}
                  onChange={handleRegisterChange}
                  className="block w-[84%] mx-auto my-3 p-2 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-base transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                  required
                />
                <input
                  type="password"
                  name="contrasena"
                  placeholder="Contraseña"
                  value={registerData.contrasena}
                  onChange={handleRegisterChange}
                  className="block w-[84%] mx-auto my-3 p-2 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-base transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  value={registerData.correo}
                  onChange={handleRegisterChange}
                  className="block w-[84%] mx-auto my-3 p-2 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-base transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                  required
                />

                {/* Campos condicionales solo para el rol 'jugador' */}
                {registerData.rol === "jugador" && (
                  <>
                    <input
                      type="number"
                      name="altura"
                      placeholder="Altura (metros)"
                      value={registerData.altura}
                      onChange={handleRegisterChange}
                      step="0.01"
                      className="block w-[84%] mx-auto my-3 p-2 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-base transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="posicion"
                      placeholder="Posición"
                      value={registerData.posicion}
                      onChange={handleRegisterChange}
                      className="block w-[84%] mx-auto my-3 p-2 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-base transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                    />
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      placeholder="Fecha de nacimiento"
                      value={registerData.fecha_nacimiento}
                      onChange={handleRegisterChange}
                      className="block w-[84%] mx-auto my-3 p-2 bg-transparent border-l-[5px] border-l-[#E12836] text-white font-light text-base transition-all duration-200 focus:outline-none focus:bg-[#E12836]/20 focus:rounded-[20px] focus:border-transparent"
                    />
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="block w-[84%] mx-auto my-3 p-2 text-center bg-[#E12836] text-white rounded disabled:opacity-50"
                >
                  {loading ? "Registrando..." : "Registrarse"}
                </button>

                <div className="w-[84%] mx-auto my-3 text-center cursor-pointer" onClick={() => setFormType("login")}>
                  <p className="text-gray-300 text-sm">Volver al inicio de sesión</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Otras opciones */}
        {formType === "login" && (
          <div className="absolute w-full h-[30px] bottom-0.5 left-0">
            <div
              className="relative float-left w-full mx-auto bg-black/20 border-b-2 border-b-[#E12836] cursor-pointer"
              onClick={() => setFormType("register")}
            >
              <p className="m-0 leading-[30px] text-center text-gray-300 text-xs font-thin">Nuevo Usuario</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

