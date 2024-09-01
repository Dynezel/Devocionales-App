import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationBell from '../Images/Notification_Bell_2-transformed.png';
import '../css/NotificationDropdown.css';
import MensajeriaPopup from './Mensajeria';

const NotificationDropdown = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationActiva, setNotificationActiva] = useState(null);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notificaciones/${user.idUsuario}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };

    fetchNotifications();
  }, [user.idUsuario]);

  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(`http://localhost:8080/notificaciones/marcar-como-leida/${notification.id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, visto: true } : n
        )
      );

      if (notification.tipo === 'mensaje') {
        setNotificationActiva(notification.usuarioEmisorId);
      } else {
        // Maneja otros tipos de notificaciones aquí si es necesario
      }
    } catch (error) {
      console.error('Error handling notification click', error);
    }
  };

  const handleClickIconoNotificacion = () => {
    setDropdownAbierto(!dropdownAbierto);
  };

  return (
    <div className="notification-container">
      <img
        src={NotificationBell}
        className="notification-bell"
        alt="Notification Bell"
        onClick={handleClickIconoNotificacion}
      />
      {dropdownAbierto && (
        <div className="notification-dropdown">
          <h3>Tus Notificaciones</h3>
          <ul>
            {notifications.length === 0 ? (
              <li className="notification-item">No hay nuevas notificaciones</li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`notification-item ${notification.visto ? 'leida' : 'no-leida'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {notification.mensaje}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      {notificationActiva && (
        <MensajeriaPopup
          usuarioId={notificationActiva}
          usuarioActualId={user.idUsuario}
          onClose={() => setNotificationActiva(null)}
        />
      )}
    </div>
  );
};

export default NotificationDropdown;