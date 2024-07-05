import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/Mensajeria.css";
import Conversaciones from "./Conversaciones";
import ChatPestaña from "./ChatPestania";

export default function MensajeriaPopup({ usuarioId, usuarioActualId, onClose }) {
  const [conversacion, setConversacion] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [minimizado, setMinimizado] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState(""); // Nuevo estado para el nombre
  const [mostrarConversaciones, setMostrarConversaciones] = useState(false); // Nuevo estado para mostrar conversaciones
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Nuevo estado para manejar el usuario seleccionado
  const popupRef = useRef(null);


  useEffect(() => {
    const obtenerConversacion = async () => {
      try {
        const response = await axios.get("http://localhost:8080/mensajes/conversacion", {
          params: {
            emisorId: usuarioActualId,
            receptorId: usuarioId,
          },
        });
        setConversacion(response.data);
        console.log(conversacion)
      } catch (error) {
        console.error("Error al obtener la conversacion:", error);
      }
    };

    const obtenerNombreUsuario = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/usuario/perfil/${usuarioId}`);
        setNombreUsuario(response.data.nombre); // Asigna el nombre del usuario al estado
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
      }
    };

    obtenerConversacion();
    obtenerNombreUsuario(); // Llama a la función para obtener el nombre del usuario
  }, [usuarioId, usuarioActualId]);

  

  const enviarMensaje = async () => {
    if (nuevoMensaje.trim() === "") return;
    try {
      const response = await axios.post("http://localhost:8080/mensajes/enviar", {
        emisorId: usuarioActualId,
        receptorId: usuarioId,
        contenido: nuevoMensaje,
      });
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

  const abrirConversaciones = () => setMostrarConversaciones(true);

  const seleccionarConversacion = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarConversaciones(false);
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
        <span>Mensajes con {nombreUsuario || "Seleccione una conversación"}</span>
        <button onClick={toggleMinimizado}>{minimizado ? "Expandir" : "Minimizar"}</button>
        <button onClick={onClose}>Cerrar</button>
        <button onClick={abrirConversaciones}>Ver Conversaciones</button>
      </div>
      {!minimizado && (
        <div className="popup-body">
          {mostrarConversaciones ? (
            <Conversaciones
              usuarioActualId={usuarioActualId}
              seleccionarConversacion={seleccionarConversacion}
            />
          ) : (
            <>
              <div className="mensajes">
                {conversacion.map((mensaje) => (
                  <div key={mensaje.id} className={`mensaje ${mensaje.emisor.id === usuarioActualId ? "enviado" : "recibido"}`}>
                    <strong>{mensaje.emisor.nombre}:</strong> {mensaje.contenido}
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
          )}
        </div>
      )}
    </div>
  );
}
