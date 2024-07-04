import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { conseguirDatosBiblia } from "../Servicios/bibliaServicio";
import Comentarios from "./Comentarios";
import "@fortawesome/fontawesome-free/css/all.css";

export default function Devocional() {
  const [usuarios, setUsuarios] = useState([]);
  const [user, setUser] = useState([]);
  const [libros, setLibros] = useState([]);
  const [devocionales, setDevocionales] = useState([]);
  const [devocionalExpandido, setDevocionalExpandido] = useState(null);
  const [comentariosVisibles, setComentariosVisibles] = useState({});
  const [bookAbbr, setBookAbbr] = useState("");
  const [bookName, setBookName] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [verseData, setVerseData] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [versiculos, setVersiculos] = useState([]);
  const [filtroTitulo, setFiltroTitulo] = useState(""); // Estado para el filtro de búsqueda
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]); // Estado para los resultados de búsqueda
  const [meGustas, setMeGustas] = useState({}); // Estado para almacenar los "Me Gusta" por devocional
  const [likesPorUsuario, setLikesPorUsuario] = useState([]); // Estado para almacenar los "Me Gusta" de un usuario

  const modules = {
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
  };

  const { idUsuario, devocionalId } = useParams();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const responseUsuarios = await axios.get(
          "http://localhost:8080/usuario/lista"
        );
        setUsuarios(responseUsuarios.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    obtenerDatos();
  }, [idUsuario]);

  //Llama a los datos del usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/usuario/perfil",
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const traerDatosBiblia = async () => {
      try {
        const datos = await conseguirDatosBiblia();
        setLibros(datos);
      } catch (error) {
        console.error("Error al traer los datos: ", error);
      }
    };
    traerDatosBiblia();
  }, []);

  const toggleExpandido = (id) => {
    // Si el devocional ya está expandido, lo colapsamos
    if (devocionalExpandido === id) {
      setDevocionalExpandido(null);
    } else {
      // Si no está expandido, lo expandimos y actualizamos las vistas
      setDevocionalExpandido(id);
      incrementarVistas(id);
      obtenerLikes(id);
    }
  };

  const toggleComentarios = (devocionalId) => {
    setComentariosVisibles((prevState) => ({
      ...prevState,
      [devocionalId]: !prevState[devocionalId],
    }));
  };

  // Metodos para busqueda de Devocional
  useEffect(() => {
    const handleBusquedaTitulo = async () => {
      try {
        if (filtroTitulo.trim() === "") {
          // Si el campo de búsqueda está vacío, mostrar la lista completa de devocionales
          setResultadosBusqueda(devocionales);
        } else {
          // Si hay un término de búsqueda, filtrar devocionales por el título
          const response = await axios.get(
            "http://localhost:8080/devocionales/buscar",
            {
              params: { nombre: filtroTitulo },
            }
          );
          setResultadosBusqueda(response.data);
        }
      } catch (error) {
        console.error("Error al buscar devocionales:", error);
      }
    };

    handleBusquedaTitulo();
  }, [devocionales, filtroTitulo]);

  const handleBookChange = (e) => {
    const selectedBookAbbr = e.target.value;
    setBookAbbr(selectedBookAbbr);
    setChapter("");
    setVerse("");

    const selectedBook = libros.find(
      (libro) => libro.abrev === selectedBookAbbr
    );
    if (selectedBook) {
      setBookName(selectedBook.names[0]);
      const chaptersArray = Array.from(
        { length: selectedBook.chapters },
        (_, i) => i + 1
      );
      setCapitulos(chaptersArray);
    }
  };

  const handleChapterChange = (e) => {
    const selectedChapter = e.target.value;
    setChapter(selectedChapter);
    setVerse("");

    if (selectedChapter && bookAbbr) {
      axios
        .get(
          `https://bible-api.deno.dev/api/read/nvi/${bookAbbr}/${selectedChapter}`
        )
        .then((response) => {
          setVerseData(response.data);
          setVersiculos(response.data.vers);
        })
        .catch((error) => {
          console.error("Error al obtener los versículos del capítulo:", error);
        });
    } else {
      setVerseData(null);
      setVersiculos([]);
    }
  };

  const handleVerseChange = (e) => {
    const selectedVerse = e.target.value;
    setVerse(selectedVerse);
  };

  const incrementarVistas = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/${id}/vistas`,
        {}
      );
      if (!response.ok) {
        console.log("Vista Actualizada");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerLikes = async (id) => {
    if (!user || !user.idUsuario) {
      console.error("Usuario no autenticado");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/devocionales/${id}/megusta`
      );
      const likesData = response.data;
      const userLiked = likesData.some((like) => like.usuarioId === user.idUsuario);

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

  // Método para alternar "Me Gusta"
    const toggleMeGusta = async (devocionalId) => {
      if (!user || !user.idUsuario) {
        console.error("Usuario no autenticado");
        return;
      }
  
      try {
        const response = await axios.post(
          `http://localhost:8080/devocionales/${devocionalId}/megusta`,
          null,
          {
            params: {
              usuarioId: user.idUsuario,
            },
          }
        );
  
        const nuevoMeGusta = response.data;
        setMeGustas((prevState) => ({
          ...prevState,
          [devocionalId]: nuevoMeGusta
            ? prevState[devocionalId] + 1
            : prevState[devocionalId] - 1,
        }));
  
        const meGustasResponse = await axios.get(
          `http://localhost:8080/devocionales/${devocionalId}/megusta`
        );
        const likesData = meGustasResponse.data;
        const userLiked = likesData.some((like) => like.usuarioId === user.idUsuario);
  
        setLikesPorUsuario((prevState) => ({
          ...prevState,
          [devocionalId]: userLiked,
        }));
      } catch (error) {
        console.error("Error al alternar 'Me Gusta':", error);
      }
    };

  const renderDevocionalContent = (devocional) => {
    if (!devocional) {
      return <p>Información del devocional no disponible.</p>;
    }

    const { nombre, descripcion, fechaCreacion, autor } = devocional;

    return (
      <div className="devocional-container">
        <h2>
          {" "}
          <u> {nombre || "Nombre no disponible"} </u>{" "}
        </h2>
        <ReactQuill
          theme="snow"
          value={descripcion || "Descripción no disponible"}
          readOnly={true}
          modules={modules}
        />
        {/* Contenedor de likes*/ }
        <div className="likes-container">
          <span>Vistas: {devocional.vistas}</span>
        <button
            onClick={() => toggleMeGusta(devocional.id)}
            className={`like-button ${likesPorUsuario[devocional.id] ? "liked" : "not-liked"}`}
          >
            <i
              className={`fa-heart ${likesPorUsuario[devocional.id] ? "fas" : "far"}`}
            ></i>
            {likesPorUsuario[devocional.id] ? "" : ""}
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
              {autor.nombre || "Nombre no disponible"}
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
            usuarioId={autor.idUsuario}
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
        {resultadosBusqueda.length > 0
          ? resultadosBusqueda.map((devocional) => (
              <div key={devocional.id} className="devocional">
                <h3
                  className="titulo"
                  onClick={() => toggleExpandido(devocional.id)}
                  style={{ cursor: "pointer" }}
                >
                  {devocional.nombre || "Nombre no disponible"}
                </h3>
                {devocionalExpandido === devocional.id &&
                  renderDevocionalContent(devocional)}
              </div>
            ))
          : usuarios.map((usuario) =>
              usuario.devocionales.map((devocional) => (
                <div key={devocional.id} className="devocional">
                  <h3
                    className="titulo"
                    onClick={() => toggleExpandido(devocional.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {devocional.nombre || "Nombre no disponible"}
                  </h3>
                  {devocionalExpandido === devocional.id &&
                    renderDevocionalContent({ ...devocional, autor: usuario })}
                </div>
              ))
            )}
      </div>
      <div className="versiculos-container">
        <h2>Buscar Capítulo</h2>
        <form>
          <label>
            Libro:
            <select value={bookAbbr} onChange={handleBookChange}>
              <option value="">Selecciona un libro</option>
              {libros.map((libro) => (
                <option key={libro.abrev} value={libro.abrev}>
                  {libro.names[0]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Capítulo:
            <select value={chapter} onChange={handleChapterChange}>
              <option value="">Selecciona un capítulo</option>
              {capitulos.map((capitulo) => (
                <option key={capitulo} value={capitulo}>
                  {capitulo}
                </option>
              ))}
            </select>
          </label>
          {chapter && (
            <label>
              Versículo:
              <select value={verse} onChange={handleVerseChange}>
                <option value="">Selecciona un versículo</option>
                {versiculos.map((versiculo, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </label>
          )}
        </form>
        {verseData ? (
          <div>
            {verse ? (
              <div>
                <h3>
                  Capítulo {chapter} Versículo {verse}
                </h3>{" "}
                {/* Muestra el número del versículo seleccionado */}
                {verseData.vers && verseData.vers[verse - 1] && (
                  <div>
                    <p>
                      <strong>{verse}</strong>.{" "}
                      {verseData.vers[verse - 1].verse}
                    </p>{" "}
                    {/* Muestra el versículo seleccionado */}
                    {verseData.vers[verse - 1].study && (
                      <p>Estudio: {verseData.vers[verse - 1].study}</p>
                    )}{" "}
                    {/* Muestra el estudio si existe */}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3>Capítulo {chapter}</h3>
                {verseData.vers && // Agregar esta verificación para evitar errores
                  verseData.vers.map((verseItem, index) => (
                    <div key={index}>
                      <p>
                        <strong>{index + 1}</strong>. {verseItem.verse}
                      </p>
                      {verseItem.study && <p>Estudio: {verseItem.study}</p>}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
