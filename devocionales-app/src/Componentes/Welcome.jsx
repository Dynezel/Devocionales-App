import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Welcome = () => {
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      {user && (
        <div>
          <p>Nombre: {user.nombre}</p>
          <p>Email: {user.email}</p>
          <p>Celular: {user.celular}</p>
          {user.fotoPerfil && ( // Verifica si hay una imagen de perfil
            <div>
              <p>Imagen de perfil:</p>
              <img src={`http://localhost:8080/imagen/${user.idUsuario}`} alt="Imagen de perfil" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Welcome;
