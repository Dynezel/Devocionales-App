import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Comentarios from "./Comentarios";
import "@fortawesome/fontawesome-free/css/all.css";
import BibliaAPI from "./BibliaAPI";

export default function Devocionales() {
  const [usuarios, setUsuarios] = useState([]);
  const [user, setUser] = useState(null);
  const [devocionales, setDevocionales] = useState([]);
  const [devocionalExpandido, setDevocionalExpandido] = useState(null);
  const [comentariosVisibles, setComentariosVisibles] = useState({});
  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [meGustas, setMeGustas] = useState({});
  const [likesPorUsuario, setLikesPorUsuario] = useState({});
  const navigate = useNavigate(); // Inicializa useNavigate

  const modules = {
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [responseUsuarios, responseUser] = await Promise.all([
          axios.get("http://localhost:8080/usuario/lista"),
          axios.get("http://localhost:8080/usuario/perfil", {
            withCredentials: true,
          }),
        ]);
        setUsuarios(responseUsuarios.data);
        setUser(responseUser.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  useEffect(() => {
    const handleBusquedaTitulo = async () => {
      try {
        if (filtroTitulo.trim() === "") {
          setResultadosBusqueda(devocionales);
        } else {
          const response = await axios.get(
            "http://localhost:8080/devocionales/buscar",
            { params: { nombre: filtroTitulo } }
          );
          setResultadosBusqueda(response.data);
        }
      } catch (error) {
        console.error("Error al buscar devocionales:", error);
      }
    };

    handleBusquedaTitulo();
  }, [devocionales, filtroTitulo]);

  const handleDevocionalClick = (id, autorId) => {
    navigate(`/devocional/${id}?autorId=${autorId}`);
    incrementarVistas(id);
  };

  const incrementarVistas = async (id) => {
    try {
      await axios.post(`http://localhost:8080/${id}/vistas`);
    } catch (error) {
      console.error("Error al incrementar vistas:", error);
    }
  };

  const obtenerLikes = async (id) => {
    if (!user?.idUsuario) {
      console.error("Usuario no autenticado");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/devocionales/${id}/megusta`
      );
      const likesData = response.data;
      const userLiked = likesData.some(
        (like) => like.usuarioId === user.idUsuario
      );

      setMeGustas((prevState) => ({
        ...prevState,
        [id]: likesData.length,
      }));
      setLikesPorUsuario((prevState) => ({
        ...prevState,
        [id]: userLiked,
      }));
    } catch (error) {
      console.error("Error al obtener los 'Me Gusta':", error);
    }
  };

  const toggleMeGusta = async (devocionalId) => {
    if (!user?.idUsuario) {
      console.error("Usuario no autenticado");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/devocionales/${devocionalId}/megusta`,
        null,
        { params: { usuarioId: user.idUsuario } }
      );

      const nuevoMeGusta = response.data;
      setMeGustas((prevState) => ({
        ...prevState,
        [devocionalId]: nuevoMeGusta
          ? prevState[devocionalId] + 1
          : prevState[devocionalId] - 1,
      }));
      setLikesPorUsuario((prevState) => ({
        ...prevState,
        [devocionalId]: !prevState[devocionalId],
      }));
    } catch (error) {
      console.error("Error al alternar 'Me Gusta':", error);
    }
  };

  const toggleComentarios = (devocionalId) => {
    setComentariosVisibles((prevState) => ({
      ...prevState,
      [devocionalId]: !prevState[devocionalId],
    }));
  };

  const renderDevocionalContent = (devocional) => {
    if (!devocional) return <p>Información del devocional no disponible.</p>;

    const { nombre, descripcion, fechaCreacion, autor } = devocional;

    return (
      <div className="devocional-container">
        <h2>
          <u>{nombre || "Nombre no disponible"}</u>
        </h2>
        <ReactQuill
          theme="snow"
          value={descripcion || "Descripción no disponible"}
          readOnly={true}
          modules={modules}
        />
        <div className="likes-container">
          <span>Vistas: {devocional.vistas}</span>
          <button
            onClick={() => toggleMeGusta(devocional.id)}
            className={`like-button ${
              likesPorUsuario[devocional.id] ? "liked" : "not-liked"
            }`}
          >
            <i
              className={`fa-heart ${
                likesPorUsuario[devocional.id] ? "fas" : "far"
              }`}
            ></i>
            <span> {meGustas[devocional.id] || 0} </span>
          </button>
        </div>

        <p className="devocional-fecha">
          Fecha de Creación: {fechaCreacion || "Fecha no disponible"}
        </p>
        <p className="devocional-autor">
          Autor:
          {autor && autor.idUsuario ? (
            <Link to={`/usuario/perfil/${autor.idUsuario}`}>
              {autor.nombre || autor.username || "Nombre no disponible"}
            </Link>
          ) : (
            "Información del autor no disponible"
          )}
        </p>
        <button
          onClick={() => toggleComentarios(devocional.id)}
          className="mostrar-comentarios-boton"
        >
          {comentariosVisibles[devocional.id]
            ? "Ocultar comentarios"
            : "Mostrar comentarios"}
        </button>
        {comentariosVisibles[devocional.id] && (
          <Comentarios
            devocionalId={devocional.id}
            usuarioId={autor?.idUsuario || null}
          />
        )}
      </div>
    );
  };

  return (
    <div className="devocionales-container">
      <div className="devocionales">
        <input
          type="text"
          placeholder="Buscar por título"
          value={filtroTitulo}
          onChange={(e) => setFiltroTitulo(e.target.value)}
          className="busqueda-input"
        />
        {(resultadosBusqueda.length > 0
          ? resultadosBusqueda
          : usuarios.flatMap((usuario) =>
              usuario.devocionales.map((devocional) => ({
                ...devocional,
                autor: usuario,
              }))
            )
        ).map((devocional) => (
          <div key={devocional.id} className="devocional">
            <h3
              className="titulo"
              onClick={() => handleDevocionalClick(devocional.id, devocional.autor.idUsuario)}
              style={{ cursor: "pointer" }}
            >
              {devocional.nombre || "Nombre no disponible"}
            </h3>
            {devocionalExpandido === devocional.id &&
              renderDevocionalContent(devocional)}
          </div>
        ))}
      </div>
      <div className="versiculos-container">
        <BibliaAPI />
      </div>
    </div>
  );
}