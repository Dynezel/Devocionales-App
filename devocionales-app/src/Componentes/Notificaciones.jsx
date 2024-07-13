import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Notificaciones.css";

export default function Notificaciones({ usuarioId }) {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notificaciones/${usuarioId}`);
        setNotificaciones(response.data);
        console.log("notificaciones: ", notificaciones)
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    obtenerNotificaciones();
  }, [usuarioId]);

  const marcarComoVisto = async (id) => {
    try {
      await axios.post(`http://localhost:8080/notificaciones/marcar-como-leido/${id}`);
      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.map((notif) =>
          notif.id === id ? { ...notif, visto: true } : notif
        )
      );
    } catch (error) {
      console.error("Error al marcar la notificación como vista:", error);
    }
  };

  return (
    <div className="notificaciones-popup">
      <h2>Notificaciones</h2>
      <ul>
        {notificaciones.map((notif) => (
          <li
            key={notif.id}
            className={`notificacion ${notif.visto ? "visto" : "no-visto"}`}
            onClick={() => marcarComoVisto(notif.id)}
          >
            <p>{notif.mensaje}</p>
            <span>{new Date(notif.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
