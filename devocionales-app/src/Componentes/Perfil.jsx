import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [imagenPerfil, setImagenPerfil] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/usuario/perfil', { withCredentials: true });
        setUser(response.data);

        // Si hay una imagen de perfil, cargarla
        if (response.data.fotoPerfil) {
          cargarImagenPerfil(response.data.idUsuario); // Utilizar el ID de usuario
        }
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    fetchUser();
  }, []);

  // Función para cargar la imagen de perfil del usuario
  const cargarImagenPerfil = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:8080/imagen/perfil/${idUsuario}`, { responseType: 'arraybuffer', withCredentials: true });

      // Crear una URL de objeto para mostrar la imagen
      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setImagenPerfil(url);
    } catch (error) {
      console.error('Error al cargar la imagen de perfil:', error);
    }
  };

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      {user && (
        <div>
          <p>Nombre: {user.nombre}</p>
          <p>Email: {user.email}</p>
          <p>Celular: {user.celular}</p>
          {imagenPerfil && ( // Verifica si hay una imagen de perfil
            <div>
              <p>Imagen de perfil:</p>
              <img src={imagenPerfil} alt="Imagen de perfil" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
