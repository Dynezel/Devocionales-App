import React, { useEffect, useState } from "react";
import LogoImg from "../Images/DevocionalesWebIconBlack2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatDropdown from "./ChatDropdown";
import NotificationDropdown from "./NotificationDropdown";
import MensajeriaPopup from "./Mensajeria";

export default function NavBar({ handleConversacionClick }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationActiva, setNotificationActiva] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout", null, {
        withCredentials: true,
      });
      console.log("Logout successful, redirecting to login.");
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
          console.log("User fetched successfully:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();

    // Intervalo para verificar la sesión cada 30 segundos
    const sessionInterval = setInterval(async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/session-status",
          { withCredentials: true }
        );
        console.log("Session status:", response.data);

        if (
          response.data.status === "unauthenticated" ||
          (response.data.status === "active" && !response.data.active)
        ) {
          console.log(
            "Session expired or user is unauthenticated, logging out."
          );
          setSessionExpired(true);
          handleLogout(); // Cierra sesión inmediatamente
        } else {
          setSessionExpired(false); // Reset session expired flag if session is active
        }
      } catch (error) {
        console.error("Error checking session status", error);
      }
    }, 7200000);

    return () => clearInterval(sessionInterval);
  }, [navigate, sessionExpired]);

  const handleConversacionesClick = () => {
    if (user?.idUsuario) {
      console.log("Navigating to conversation with user ID:", user.idUsuario);
      navigate(`/conversaciones/${user.idUsuario}`);
    } else {
      console.log("Error: Unable to load user ID.");
    }
  };

  if (!user) {
    return (
      <header className="header">
        <Link className="icon" to={"/"}>
          <img src={LogoImg} alt="Logo" className="logo" />
        </Link>
        <nav className="links">
          <Link to={"/usuario/registro"}>Regístrate</Link>
          <Link to={"/login"}>Inicia Sesión</Link>
        </nav>
        {sessionExpired && (
          <div className="session-expired-message">
            Tu sesión ha expirado, inicia sesión
          </div>
        )}
      </header>
    );
  }

  const handleCloseMensajeria = () => {
    setNotificationActiva(null);
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
        <nav className={`links ${user ? "logged-in" : ""}`}>
          <div className="nav-items">
            <Link to={"/devocionales/crear"}>Crear Devocional</Link>
            <ChatDropdown
              handleConversacionClick={handleConversacionClick}
              user={user}
            />
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
                  <Link to={"/usuario/perfil"}>
                    <button className="boton-menu-navbar">Perfil</button>
                  </Link>

                  <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      {notificationActiva && (
        <MensajeriaPopup
          usuarioId={notificationActiva}
          usuarioActualId={user.idUsuario}
          onClose={handleCloseMensajeria}
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
