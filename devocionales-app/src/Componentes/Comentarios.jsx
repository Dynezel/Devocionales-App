import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Comentarios({ devocionalId }) {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState("")
  const [user, setUser] = useState('');

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
        const response = await axios.get(`http://localhost:8080/${devocionalId}/comentarios`);
        setComentarios(response.data);
      } catch (error) {
        console.error('Error al cargar comentarios', error);
      }
    };

    fetchComentarios();
  }, [devocionalId]);

  const handleAgregarComentario = async () => {
    try {
      const fechaActual = new Date();
      const response = await axios.post(`http://localhost:8080/${devocionalId}/comentarios`, {
        texto: nuevoComentario,
        fechaCreacion: fechaActual 
      }, {
        withCredentials: true
      });

      // Actualizar los comentarios con el nuevo comentario creado
      setComentarios([...comentarios, response.data]);
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
