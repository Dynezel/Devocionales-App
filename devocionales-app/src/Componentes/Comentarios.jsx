import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Comentarios({ devocionalId, usuarioId }) {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [user, setUser] = useState(null);

  // Obtener el usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/usuario/perfil', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    fetchUser();
  }, []);

  // Obtener los comentarios del devocional específico y usuario específico
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/devocionales/${devocionalId}/comentarios`, {
          params: { usuarioId }
        });

        // Para cada comentario, obtener el usuario completo
        const comentariosConUsuario = await Promise.all(response.data.map(async (comentario) => {
          const usuarioResponse = await axios.get(`http://localhost:8080/usuario/perfil/${comentario.idUsuario}`);
          comentario.usuario = usuarioResponse.data;
          return comentario;
        }));

        setComentarios(comentariosConUsuario);
      } catch (error) {
        console.error('Error al cargar comentarios', error);
      }
    };

    fetchComentarios();
  }, [devocionalId, usuarioId]);

  // Manejar la creación de un nuevo comentario
  const handleAgregarComentario = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/devocionales/${devocionalId}/comentarios`, {
        texto: nuevoComentario,
      }, {
        withCredentials: true
      });

      // Agregar el nuevo comentario a la lista actual
      const nuevoComentarioConUsuario = {
        ...response.data,
        usuario: user // Asignar el usuario actual al nuevo comentario
      };
      setComentarios([...comentarios, nuevoComentarioConUsuario]);
      setNuevoComentario('');
    } catch (error) {
      console.error('Error al agregar comentario', error);
    }
  };

  return (
    <div>
      <h3>Comentarios</h3>
      {comentarios.length > 0 ? (
        <ul>
          {comentarios.map((comentario) => (
            <li key={comentario.id}>
              {comentario.usuario.idUsuario && (
              <img className='imagenComentario' src={`http://localhost:8080/imagen/perfil/${comentario.usuario.idUsuario}`} alt="Imagen de perfil" />
            )}
            <strong>{comentario.usuario.nombre}:</strong> {comentario.texto}
          </li>
          ))}
        </ul>
      ) : (
        <p>No hay comentarios todavía</p>
      )}
      <textarea
        value={nuevoComentario}
        onChange={(e) => setNuevoComentario(e.target.value)}
        placeholder="Escribe tu comentario"
      />
      <button onClick={handleAgregarComentario}>Agregar Comentario</button>
    </div>
  );
}
