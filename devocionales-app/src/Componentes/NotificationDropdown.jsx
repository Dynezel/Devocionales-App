import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/NotificationDropdown.css"; 

const NotificationDropdown = ({ userId, setNotificationActiva }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notificaciones/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(`http://localhost:8080/notificaciones/marcar-como-leida/${notification.id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, visto: true } : n
        )
      );

      if (notification.tipo === "mensaje") {
        setNotificationActiva(notification.usuarioEmisorId);
      } else {
        // Si no es un mensaje, puedes manejar otros tipos de notificaciones aquí
      }
    } catch (error) {
      console.error("Error handling notification click", error);
    }
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-content">
        <h3>Tus Notificaciones</h3>
        <ul>
          {notifications.length === 0 ? (
            <li className="notification-item">No hay nuevas notificaciones</li>
          ) : (
            notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-item ${notification.visto ? "leida" : "no-leida"}`}
                onClick={() => handleNotificationClick(notification)}
              >
                {notification.mensaje}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationDropdown;
