import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Comentarios from "./Comentarios"; // Asegúrate de que la ruta al componente sea correcta
import "../css/PerfilUsuario.css"; // Importa tus estilos
import Seguidores from "./Seguidores";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const modules = {
    toolbar: false,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/usuario/perfil",
          { withCredentials: true }
        );
        setUser(response.data);
        // Si hay una imagen de perfil, cargarla
        if (response.data.fotoPerfil) {
          cargarImagenPerfil(response.data.idUsuario);
        }
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  const cargarImagenPerfil = async (idUsuario) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/imagen/perfil/${idUsuario}`,
        { responseType: "arraybuffer", withCredentials: true }
      );
      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setImagenPerfil(url);
    } catch (error) {
      console.error("Error al cargar la imagen de perfil:", error);
    }
  };

  return (
    <div className="perfil-container">
      <h2>Perfil de Usuario</h2>
      {user && (
        <div className="perfil-header">
          <div className="perfil-info">
            <div className="perfil-main">
              {imagenPerfil && (
                <img
                  className="profile-picture"
                  src={imagenPerfil}
                  alt="Imagen de Perfil"
                />
              )}
              <div className="perfil-details">
                <p className="perfil-nombre">{user.nombre}</p>
                <p className="perfil-username">@{user.nombreUsuario}</p>
                <div className="perfil-bio">
                  <p className="bio">{user.biografia}</p>
                </div>
                {/* Incluye el componente Seguidores */}
                <Seguidores
                  className="seguidores-container"
                  usuarioId={user.idUsuario}
                  usuarioActualId={user.idUsuario} 
                />
                <div className="botones-container"></div>
              </div>
            </div>
          </div>
          <div className="perfil-body">
            <div className="perfil-stats">
              {/*<p><strong>Email:</strong> {user.email}</p>
    <p><strong>Celular:</strong> {user.celular}</p>*/}
            </div>
            <div className="perfil-devocionales">
              <h3>
                <u>Devocionales Creados</u>
              </h3>
              {user.devocionales.length > 0 ? (
                user.devocionales.map((devocional, index) => (
                  <div key={devocional.id}>
                    {index !== 0 && <hr className="devocional-separador" />}
                    <div className="devocional-item">
                      <div className="devocional-content">
                        <h2 className="devocional-titulo">
                          {" "}
                          <u>
                            {" "}
                            {devocional.nombre || "Título no disponible"}{" "}
                          </u>{" "}
                        </h2>
                        <ReactQuill
                          theme="snow"
                          value={
                            devocional.descripcion ||
                            "Descripción no disponible"
                          }
                          readOnly={true}
                          modules={modules}
                          className="devocional-descripcion"
                        />
                        <p className="devocional-fecha">
                          <strong>Fecha de Creación:</strong>{" "}
                          {devocional.fechaCreacion || "Fecha no disponible"}
                        </p>
                        <p className="devocional-autor">
                          <strong>Autor:</strong>
                          {user.idUsuario ? (
                            <Link to={`/usuario/perfil/${user.idUsuario}`}>
                              {user.nombre || "Nombre no disponible"}
                            </Link>
                          ) : (
                            "Información del autor no disponible"
                          )}
                        </p>
                        <Comentarios
                          devocionalId={devocional.id}
                          usuarioId={user.idUsuario}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Este usuario no creó ningún devocional aún.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}