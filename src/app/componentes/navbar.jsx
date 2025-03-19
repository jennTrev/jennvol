"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Home, User, TestTube, LogOut, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navbarRef = useRef(null)
  const selectorRef = useRef(null)
  const navItemsRef = useRef([])

  const menuItems = [
    { name: "Inicio", icon: <Home size={18} />, href: "/inicio" },
    { name: "Perfil", icon: <User size={18} />, href: "/profile" },
    { name: "Pruebas", icon: <TestTube size={18} />, href: "/tests" },
    {
      name: "Salir",
      icon: <LogOut size={18} />,
      href: "#",
      onClick: () => {
        localStorage.removeItem("userId")
        router.push("/")
      },
    },
  ]

  // Agregar navegación basada en roles al montar el componente
  useEffect(() => {
    const checkUserRole = async () => {
      const userId = localStorage.getItem("userId")

      if (userId) {
        try {
          const response = await fetch(`https://reactvolt.onrender.com/usuarios/${userId}`)

          if (response.ok) {
            const userData = await response.json()
            const userRole = userData.rol

            // Establecer el elemento activo correcto según la ruta actual
            const path = window.location.pathname

            if (path.includes("/inicio")) {
              setActiveItem(0)
            } else if (path.includes("/profile")) {
              setActiveItem(1)
            } else if (path.includes("/tests")) {
              setActiveItem(2)
            }

            // Redirigir si el usuario está en el panel incorrecto
            if (userRole === "entrenador" && path === "/inicio") {
              router.push("/entrenador")
            } else if (userRole === "tecnico" && path === "/inicio") {
              router.push("/tecnico")
            } else if (userRole === "jugador" && (path === "/entrenador" || path === "/tecnico")) {
              router.push("/inicio")
            }
          }
        } catch (error) {
          console.error("Error al verificar el rol del usuario:", error)
        }
      }
    }

    checkUserRole()
  }, [router])

  // Actualizar la posición del selector cuando cambia el elemento activo
  useEffect(() => {
    if (navItemsRef.current.length > 0 && selectorRef.current) {
      const activeElement = navItemsRef.current[activeItem]
      if (activeElement) {
        const isDesktop = window.innerWidth >= 992

        if (isDesktop) {
          // Posicionamiento en escritorio
          selectorRef.current.style.top = `${activeElement.offsetTop}px`
          selectorRef.current.style.left = `${activeElement.offsetLeft}px`
          selectorRef.current.style.width = `${activeElement.offsetWidth}px`
          selectorRef.current.style.height = `${activeElement.offsetHeight}px`
        } else {
          // Posicionamiento en móvil
          selectorRef.current.style.top = `${activeElement.offsetTop}px`
          selectorRef.current.style.left = "10px"
          selectorRef.current.style.width = "5px"
          selectorRef.current.style.height = `${activeElement.offsetHeight}px`
        }
      }
    }
  }, [activeItem, isMobileMenuOpen])

  // Manejar el cambio de tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (navItemsRef.current.length > 0 && selectorRef.current) {
        const activeElement = navItemsRef.current[activeItem]
        if (activeElement) {
          const isDesktop = window.innerWidth >= 992

          if (isDesktop) {
            // Posicionamiento en escritorio
            selectorRef.current.style.top = `${activeElement.offsetTop}px`
            selectorRef.current.style.left = `${activeElement.offsetLeft}px`
            selectorRef.current.style.width = `${activeElement.offsetWidth}px`
            selectorRef.current.style.height = `${activeElement.offsetHeight}px`
          } else {
            // Posicionamiento en móvil
            selectorRef.current.style.top = `${activeElement.offsetTop}px`
            selectorRef.current.style.left = "10px"
            selectorRef.current.style.width = "5px"
            selectorRef.current.style.height = `${activeElement.offsetHeight}px`
          }
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeItem])

  return (
    <nav className="bg-[#E12836] px-4 py-0 relative" ref={navbarRef}>
      <div className="flex justify-between items-center">
        <Link href="/inicio" className="text-white py-4 font-bold text-xl">
          ReactVolt
        </Link>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Alternar navegación"
        >
          <Menu size={24} />
        </button>

        <div
          className={`lg:flex ${isMobileMenuOpen ? "block" : "hidden"} lg:items-center transition-all duration-300 w-full lg:w-auto`}
        >
          <ul className="lg:flex flex-col lg:flex-row relative p-0 m-0">
            {/* Selector horizontal */}
            <div
              ref={selectorRef}
              className="absolute bg-white transition-all duration-600 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] rounded-t-lg lg:mt-2.5"
            >
              <div className="absolute w-6 h-6 bg-white bottom-2.5 -right-6 before:content-[''] before:absolute before:w-12 before:h-12 before:rounded-full before:bg-[#E12836] before:bottom-0 before:-right-6"></div>
              <div className="absolute w-6 h-6 bg-white bottom-2.5 -left-6 before:content-[''] before:absolute before:w-12 before:h-12 before:rounded-full before:bg-[#E12836] before:bottom-0 before:-left-6"></div>
            </div>

            {/* Elementos del menú */}
            {menuItems.map((item, index) => (
              <li
                key={index}
                ref={(el) => (navItemsRef.current[index] = el)}
                className={`list-none ${activeItem === index ? "active" : ""}`}
              >
                <Link
                  href={item.href}
                  className={`text-white/50 no-underline text-base block py-5 px-5 transition-duration-600 transition-timing-function-[cubic-bezier(0.68,-0.55,0.265,1.55)] relative ${activeItem === index ? "text-[#E12836]" : ""}`}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault()
                      item.onClick()
                    }
                    setActiveItem(index)
                    if (window.innerWidth < 992) {
                      setIsMobileMenuOpen(false)
                    }
                  }}
                >
                  <span className="mr-2.5">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

