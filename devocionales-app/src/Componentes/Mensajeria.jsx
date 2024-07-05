import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/Mensajeria.css";

export default function MensajeriaPopup({
  usuarioId,
  usuarioActualId,
  onClose,
}) {
  const [conversacion, setConversacion] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [minimizado, setMinimizado] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [imagenPerfilUsuario, setImagenPerfilUsuario] = useState(null);
  const [imagenPerfilOtroUsuario, setImagenPerfilOtroUsuario] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const obtenerConversacion = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/mensajes/conversacion",
          {
            params: {
              emisorId: usuarioActualId,
              receptorId: usuarioId,
            },
          }
        );
        setConversacion(response.data);
      } catch (error) {
        console.error("Error al obtener la conversacion:", error);
      }
    };

    const obtenerNombreUsuario = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/usuario/perfil/${usuarioId}`
        );
        setNombreUsuario(response.data.nombre);
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
      }
    };

    const cargarImagenPerfil = async (idUsuario, setImagenPerfil) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/imagen/perfil/${idUsuario}`,
          { responseType: "arraybuffer" }
        );
        const blob = new Blob([response.data], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        console.log(`Imagen de perfil URL para el usuario ${idUsuario}:`, url); // Añade esta línea
        setImagenPerfil(url);
      } catch (error) {
        console.error("Error al cargar la imagen de perfil:", error);
      }
    };

    obtenerConversacion();
    obtenerNombreUsuario();
    cargarImagenPerfil(usuarioActualId, setImagenPerfilUsuario);
    cargarImagenPerfil(usuarioId, setImagenPerfilOtroUsuario);
  }, [usuarioId, usuarioActualId]);

  const enviarMensaje = async () => {
    if (nuevoMensaje.trim() === "") return;
    try {
      const response = await axios.post(
        "http://localhost:8080/mensajes/enviar",
        {
          emisorId: usuarioActualId,
          receptorId: usuarioId,
          contenido: nuevoMensaje,
        }
      );
      setConversacion([...conversacion, response.data]);
      setNuevoMensaje("");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const toggleMinimizado = () => setMinimizado(!minimizado);

  const dragStart = (e) => {
    const rect = popupRef.current.getBoundingClientRect();
    popupRef.current.dataset.offsetX = e.clientX - rect.left;
    popupRef.current.dataset.offsetY = e.clientY - rect.top;
  };

  const dragEnd = (e) => {
    if (popupRef.current) {
      const x = e.clientX - popupRef.current.dataset.offsetX;
      const y = e.clientY - popupRef.current.dataset.offsetY;
      popupRef.current.style.left = `${x}px`;
      popupRef.current.style.top = `${y}px`;
    }
  };

  return (
    <div
      className={`mensajeria-popup ${minimizado ? "minimizado" : ""}`}
      ref={popupRef}
      draggable
      onDragStart={dragStart}
      onDragEnd={dragEnd}
    >
      <div className="popup-header">
        <span>
          Mensajes con {nombreUsuario || "Seleccione una conversación"}
        </span>
        <button onClick={toggleMinimizado}>
          {minimizado ? "Expandir" : "Minimizar"}
        </button>
        <button onClick={onClose}>Cerrar</button>
      </div>
      {!minimizado && (
        <div className="popup-body">
          <>
            <div className="mensajes">
              {conversacion.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={`mensaje ${
                    mensaje.emisor.idUsuario == usuarioActualId
                      ? "enviado"
                      : "recibido"
                  }`}
                >
                  {mensaje.emisor.idUsuario == usuarioActualId ? (
                    <div className="mensaje-contenido enviado">
                      <div className="mensaje-texto">{mensaje.contenido}</div>
                      <img
                        src={imagenPerfilUsuario}
                        alt="Tu Imagen de Perfil"
                        className="profile-picture profile-picture-usuario"
                      />
                    </div>
                  ) : (
                    <div className="mensaje-contenido recibido">
                      <img
                        src={imagenPerfilOtroUsuario}
                        alt="Imagen de Perfil del Otro Usuario"
                        className="profile-picture profile-picture-otro"
                      />
                      <div className="mensaje-texto">{mensaje.contenido}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <input
              type="text"
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <button onClick={enviarMensaje}>Enviar</button>
          </>
        </div>
      )}
    </div>
  );
}
