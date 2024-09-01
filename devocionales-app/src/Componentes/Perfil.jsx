import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Comentarios from "./Comentarios";
import "../css/PerfilUsuario.css";
import Seguidores from "./Seguidores";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

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
        setNombre(response.data.nombre);
        setCelular(response.data.celular);
        if (response.data.fotoPerfil) {
          cargarImagenPerfil(response.data.idUsuario);
        }
      } catch (error) {
        console.error("Error fetching user", error);
        setError("Error al cargar el perfil.");
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

  const handleModificarPerfil = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:8080/usuario/perfil/modificar/${user.idUsuario}`,
        { nombre, celular },
        { withCredentials: true }
      );
      alert("Perfil modificado correctamente");
      setIsEditing(false);
      setUser({ ...user, nombre, celular });
    } catch (error) {
      console.error("Error modificando el perfil", error);
      alert("Error modificando el perfil");
    }
  };

  const handleEliminarPerfil = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu perfil?")) {
      try {
        await axios.delete(
          `http://localhost:8080/usuario/eliminar/${user.idUsuario}`,
          { withCredentials: true }
        );
        alert("Perfil eliminado correctamente");
        navigate("/"); // Redirigir al usuario después de eliminar
      } catch (error) {
        console.error("Error eliminando el perfil", error);
        alert("Error eliminando el perfil");
      }
    }
  };

  return (
    <div className="perfil-container">
      <h2>Perfil de Usuario</h2>
      {user ? (
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
                {isEditing ? (
                  <form onSubmit={handleModificarPerfil}>
                    <label>
                      Nombre:
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </label>
                    <label>
                      Celular:
                      <input
                        type="text"
                        value={celular}
                        onChange={(e) => setCelular(e.target.value)}
                      />
                    </label>
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <div>
                    <p className="perfil-nombre">{user.nombre}</p>
                    <p className="perfil-username">@{user.nombreUsuario}</p>
                    <div className="perfil-bio">
                      <p className="bio">{user.biografia}</p>
                    </div>
                    <Seguidores
                      className="seguidores-container"
                      usuarioId={user.idUsuario}
                      usuarioActualId={user.idUsuario}
                    />
                    <button onClick={() => setIsEditing(true)}>
                      Editar Perfil
                    </button>
                    <button onClick={handleEliminarPerfil}>Eliminar Perfil</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="perfil-body">
            <div className="perfil-stats"></div>
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
                          <u>{devocional.nombre || "Título no disponible"}</u>
                        </h2>
                        <ReactQuill
                          theme="snow"
                          value={devocional.descripcion || "Descripción no disponible"}
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
      ) : (
        <p>{error || "Cargando perfil..."}</p>
      )}
    </div>
  );
}