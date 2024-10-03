import React, { useEffect, useState } from "react";
import LogoImg from "../Images/DevocionalesWebIconBlack2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatDropdown from "./ChatDropdown";
import NotificationDropdown from "./NotificationDropdown";
import MensajeriaPopup from "./Mensajeria";
import iconoChat from '../Images/chat-icon3.png'; 

export default function NavBar({ handleConversacionClick }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationActiva, setNotificationActiva] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false); // Estado del menú hamburguesa
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout", null, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/usuario/perfil",
          { withCredentials: true }
        );
        if (!sessionExpired) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();

    const sessionInterval = setInterval(async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/session-status",
          { withCredentials: true }
        );

        if (
          response.data.status === "unauthenticated" ||
          (response.data.status === "active" && !response.data.active)
        ) {
          setSessionExpired(true);
          handleLogout();
        } else {
          setSessionExpired(false);
        }
      } catch (error) {
        console.error("Error checking session status", error);
      }
    }, 7200000);

    return () => clearInterval(sessionInterval);
  }, [navigate, sessionExpired]);

  const handleHamburgerClick = () => {
    setHamburgerOpen(!hamburgerOpen); // Abre/cierra el menú hamburguesa
  };

  return (
    <header className="header">
      <div className="nav-container">
        <Link className="icon" to={"/"}>
          <img
            src={LogoImg}
            alt="Logo"
            className={`logo ${user ? "logged-in" : ""}`}
          />
        </Link>

        {/* Menú hamburguesa para dispositivos móviles */}
        <div
          className={`hamburger-menu ${hamburgerOpen ? "active" : ""}`}
          onClick={handleHamburgerClick}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>

        {/* Menú principal */}
        <nav className={`links ${hamburgerOpen ? "nav-items-mobile" : ""}`}>
          {user ? (
            <div className="nav-items">
              {/* Cerrar el menú al hacer clic en cualquier opción */}
              <Link to={"/devocionales/crear"} onClick={handleHamburgerClick}>
                <strong>
                  
                Crear Devocional
                </strong>
              </Link>
              {/* Si el menú hamburguesa está abierto, usa un enlace en lugar del ChatDropdown */}
              {hamburgerOpen ? (
                <Link
                  to={`/conversaciones/${user.idUsuario}`}
                  onClick={handleHamburgerClick}
                >
                  <img
                    src={iconoChat}
                    className="chat-icon"
                    alt="Chat Icon"
                  />
                </Link>
              ) : (
                <ChatDropdown
                  handleConversacionClick={handleConversacionClick}
                  user={user}
                />
              )}
              <NotificationDropdown
                user={user}
                setNotificationActiva={setNotificationActiva}
              />
              <div
                className="user-profile"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div>{user.nombre}</div>
                <img
                  src={`http://localhost:8080/imagen/perfil/${user.idUsuario}`}
                  alt="Foto de perfil"
                  className="profile-image"
                />
                {menuOpen && (
                  <div className="user-menu">
                    {/* Cerrar el menú al hacer clic en el perfil o configuración */}
                    <Link to={"/usuario/perfil"} onClick={handleHamburgerClick}>
                      <button className="boton-menu-navbar">Perfil</button>
                    </Link>
                    <Link
                      to={"/usuario/configuracion"}
                      onClick={handleHamburgerClick}
                    >
                      <button className="boton-menu-configuracion">
                        Configuración
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        handleHamburgerClick();
                      }}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="nav-items">
              {/* Cerrar el menú al hacer clic en Regístrate o Iniciar Sesión */}
              <Link to={"/usuario/registro"} onClick={handleHamburgerClick}>
                Regístrate
              </Link>
              <Link to={"/login"} onClick={handleHamburgerClick}>
                Inicia Sesión
              </Link>
            </div>
          )}
        </nav>
      </div>

      {notificationActiva && (
        <MensajeriaPopup
          usuarioId={notificationActiva}
          usuarioActualId={user.idUsuario}
          onClose={() => setNotificationActiva(null)}
        />
      )}

      {sessionExpired && (
        <div className="session-expired-message">
          Tu sesión ha expirado, inicia sesión
        </div>
      )}
    </header>
  );
}
