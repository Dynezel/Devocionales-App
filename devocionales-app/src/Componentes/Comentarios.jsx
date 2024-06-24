import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Comentarios.css'; // Importa los estilos CSS

export default function Comentarios({ devocionalId, usuarioId }) {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/devocionales/${devocionalId}/comentarios`, {
          params: { usuarioId }
        });

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

  const handleAgregarComentario = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/devocionales/${devocionalId}/comentarios`, {
        texto: nuevoComentario,
      }, {
        withCredentials: true
      });

      const nuevoComentarioConUsuario = {
        ...response.data,
        usuario: user
      };
      setComentarios([...comentarios, nuevoComentarioConUsuario]);
      setNuevoComentario('');
    } catch (error) {
      console.error('Error al agregar comentario', error);
    }
  };

  return (
    <div className="comentarios-container">
      <h3 className="comentarios-header">Comentarios</h3>
      {comentarios.length > 0 ? (
        <ul className="comentarios-lista">
          {comentarios.map((comentario) => (
            <li key={comentario.id}>
              {comentario.usuario.idUsuario && (
                <img className='imagenComentario' src={`http://localhost:8080/imagen/perfil/${comentario.usuario.idUsuario}`} alt="Imagen de perfil" />
              )}
              <div className="comentario-texto">
                <strong className="comentario-usuario">{comentario.usuario.nombre}:</strong> {comentario.texto}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay comentarios todavía</p>
      )}
      <div className="nuevo-comentario-container">
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder="Escribe tu comentario"
          className="nuevo-comentario"
        />
        <button onClick={handleAgregarComentario} className="agregar-comentario-boton">Agregar Comentario</button>
      </div>
    </div>
  );
}
