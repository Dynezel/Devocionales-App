import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Comentarios from "./Comentarios";
import Seguidores from "./Seguidores";
import "../css/PerfilUsuario.css"; // Importa tus estilos
import MensajeriaPopup from "./Mensajeria";

export default function Perfil() {
  const { idUsuario } = useParams(); // Captura el idUsuario desde la URL
  const [user, setUser] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [mostrarMensajeria, setMostrarMensajeria] = useState(false);
  const [error, setError] = useState(null);

  const handleEnviarMensaje = () => {
    if (!usuario) {
      alert("Debes estar logeado para enviar un mensaje.");
      // Redirigir a la página de inicio de sesión si no hay usuario logueado
      window.location.href = "/login";
      return;
    }
    setMostrarMensajeria(true);
  };

  const cerrarMensajeria = () => {
    setMostrarMensajeria(false);
  };

  const modules = {
    toolbar: false,
  };

  // Llama a los datos del usuario actual
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/usuario/perfil",
          { withCredentials: true }
        );
        setUsuario(response.data);
      } catch (error) {
        console.error("Error fetching user", error);
        setError("Error fetching user");
      }
    };

    fetchUsuario();
  }, [history]);

  // Carga al Perfil de un Usuario especifico
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/usuario/perfil/${idUsuario}`
        );
        setUser(response.data);

        // Si hay una imagen de perfil, cargarla
        if (response.data.fotoPerfil) {
          cargarImagenPerfil(response.data.idUsuario);
        }
      } catch (error) {
        console.error("Error fetching user", error);
        setError("Error fetching user profile");
      }
    };

    if (idUsuario) {
      fetchUser();
    }
  }, [idUsuario]);

  // Función para cargar la imagen de perfil del usuario
  const cargarImagenPerfil = async (idUsuario) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/imagen/perfil/${idUsuario}`,
        {
          responseType: "arraybuffer",
        }
      );

      // Crear una URL de objeto para mostrar la imagen
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
                  usuarioActualId={usuario ? usuario.idUsuario : null}
                  onLoginRequired={() => history.push("/login")}
                />
                <div className="botones-container">
                  {user.idUsuario!== (usuario && usuario.idUsuario) && (
                    <button
                      className="btn-seguir"
                      onClick={handleEnviarMensaje}
                    >
                      Enviar un mensaje
                    </button>
                  )}
                  {mostrarMensajeria && (
                    <MensajeriaPopup
                      usuarioId={idUsuario}
                      usuarioActualId={usuario.idUsuario}
                      onClose={cerrarMensajeria}
                    />
                  )}
                </div>
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
                  <div>
                    {index != 0 && <hr className="devocional-separador" />}
                    <div key={devocional.id} className="devocional-item">
                      {/* Agregar separador solo si no es el último devocional */}

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
