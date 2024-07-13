import React, { useEffect, useState } from "react";
import LogoImg from "../Images/DevocionalesWebIconBlack2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DropdownConversaciones from "./ChatDropdown";
import NotificationDropdown from "./NotificationDropdown"; // Importa el nuevo componente
import NotificationBell from "../Images/notification-bell-svgrepo-com.svg"; // Ruta al archivo SVG
import MensajeriaPopup from "./Mensajeria";

export default function NavBar({ handleConversacionClick }) {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); // Estado para el dropdown de notificaciones
  const [notificationActiva, setNotificationActiva] = useState(null); // Estado para la notificación activa
  const navigate = useNavigate(); // Usa useNavigate para la navegación

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/usuario/perfil", { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  const handleConversacionesClick = () => {
    if (user.idUsuario) {
      console.log(user.idUsuario);
      navigate(`/conversaciones/${user.idUsuario}`);
    } else {
      console.log("error al cargar la id de usuario");
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
      </header>
    );
  }

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout", null, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const handleCloseMensajeria = () => {
    setNotificationActiva(null);
  };

  return (
    <header className="header">
      <div className="nav-container">
        <Link className="icon" to={"/"}>
          <img src={LogoImg} alt="Logo" className={`logo ${user ? "logged-in" : ""}`} />
        </Link>
        <nav className={`links ${user ? "logged-in" : ""}`}>
          <div className="nav-items">
            <Link to={"/devocionales"}>Devocionales</Link>
            <Link to={"/devocionales/crear"}>Crear Devocional</Link>
            <DropdownConversaciones handleConversacionClick={handleConversacionClick} user={user} />
            <div
              className="notifications"
              onMouseEnter={() => setNotificationsOpen(true)}
              onMouseLeave={() => setNotificationsOpen(false)}
            >
              <div className="notifications-icon">
                <img src={NotificationBell} className="notification-bell" /> {/* Puedes reemplazar esto con un ícono de campana */}
              </div>
              {notificationsOpen && (
                <NotificationDropdown 
                  userId={user.idUsuario} 
                  setNotificationActiva={setNotificationActiva} 
                />
              )}
            </div>
            <div className="user-profile" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
              <div>{user.nombre}</div>
              <img
                src={`http://localhost:8080/imagen/perfil/${user.idUsuario}`}
                alt="Foto de perfil"
                className="profile-image"
              />
              {menuOpen && (
                <div className="user-menu">
                  <button>
                    <Link to={"/usuario/perfil"}>Perfil</Link>
                  </button>
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
    </header>
  );
}
