import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/Seguidores.css';

export default function Seguidores({ usuarioId, usuarioActualId }) {
  const [seguidores, setSeguidores] = useState([]);
  const [seguidos, setSeguidos] = useState([]);
  const [esSeguido, setEsSeguido] = useState(false);

  useEffect(() => {
    const verificarSeguidor = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/seguidores/${usuarioId}/seguidores`);
          if (Array.isArray(response.data) && response.data.length > 0) {
            setSeguidores(response.data);
            setEsSeguido(
              response.data.some(
                (seguidor) => seguidor.usuario.idUsuario === usuarioActualId
              )
            );
            console.log(esSeguido)
          } else {
            console.error("La respuesta no es un array o está vacío:", response.data);
          }
        } catch (error) {
          console.error("Error al verificar el seguimiento:", error);
        }
      };
    verificarSeguidor();
  }, [usuarioId, usuarioActualId]);

  const seguirUsuario = async () => {
    try {
      await axios.post(`http://localhost:8080/seguidores/${usuarioActualId}/seguir/${usuarioId}`);
      setEsSeguido(true);
      actualizarSeguidores();
    } catch (error) {
      console.error("Error al seguir al usuario:", error);
    }
  };

  const dejarDeSeguirUsuario = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/seguidores/${usuarioActualId}/dejar-de-seguir/${usuarioId}`
      );
      setEsSeguido(false);
      actualizarSeguidores();
    } catch (error) {
      console.error("Error al dejar de seguir al usuario:", error);
    }
  };

  const actualizarSeguidores = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/seguidores/${usuarioId}/seguidores`);
      if (Array.isArray(response.data)) {
        setSeguidores(response.data);
      } else {
        console.error("La respuesta de seguidores no es un array:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener los seguidores:", error);
    }
  };

  useEffect(() => {
    const obtenerSeguidos = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/seguidores/${usuarioId}/seguidos`);
        if (Array.isArray(response.data)) {
          setSeguidos(response.data);
          console.log(usuarioId, usuarioActualId)
        } else {
          console.error("La respuesta de seguidos no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los seguidos:", error);
      }
    };

    obtenerSeguidos();
    actualizarSeguidores(); // Llama a actualizarSeguidores también en el primer montaje o cambio de usuarioId
  }, [usuarioId]);

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      {usuarioId !== usuarioActualId && (
        <div>
          {esSeguido ? (
            <button onClick={dejarDeSeguirUsuario}>Dejar de Seguir</button>
          ) : (
            <button onClick={seguirUsuario}>Seguir</button>
          )}
        </div>
      )}
      <div>
        <h3>Seguidores</h3>
        <p>Total: {seguidores.length}</p> {/* Mostrar el número de seguidores */}
        <ul>
          {Array.isArray(seguidores) && seguidores.length > 0 ? (
            seguidores.map((seguidor) => (
              <li key={seguidor.id}>{seguidor.usuario.nombre}</li>
            ))
          ) : (
            <li>No hay seguidores.</li>
          )}
        </ul>
      </div>
      <div>
        <h3>Seguidos</h3>
        <p>Total: {seguidos.length}</p> {/* Mostrar el número de seguidos */}
        <ul>
          {Array.isArray(seguidos) && seguidos.length > 0 ? (
            seguidos.map((seguido) => (
              <li key={seguido.id}>{seguido.seguido.nombre}</li>
            ))
          ) : (
            <li>No hay seguidos.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
