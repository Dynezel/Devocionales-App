import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { conseguirDatosBiblia } from "../Servicios/bibliaServicio";
import Comentarios from "./Comentarios";

export default function Devocional() {
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [devocionales, setDevocionales] = useState([]);
  const [devocionalExpandido, setDevocionalExpandido] = useState(null);
  const [bookAbbr, setBookAbbr] = useState("");
  const [bookName, setBookName] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [verseData, setVerseData] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [versiculos, setVersiculos] = useState([]);

  const modules = {
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
  };

  const { idUsuario } = useParams();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const responseUsuarios = await axios.get(`http://localhost:8080/usuario/lista`);
        setUsuarios(responseUsuarios.data);

      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    obtenerDatos();
  }, [idUsuario]);

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

  const toggleExpandido = (devocionalId) => {
    setDevocionalExpandido((prevDevocionalId) =>
      prevDevocionalId === devocionalId ? null : devocionalId
    );
  };

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

  const renderDevocionalContent = (devocional) => {
    if (!devocional) {
      return <p>Información del devocional no disponible.</p>;
    }

    const { descripcion, fechaCreacion, autor } = devocional;

    return (
      <div>
        <ReactQuill
          theme="snow"
          value={descripcion || "Descripción no disponible"}
          readOnly={true}
          modules={modules}
        />
        <p>Fecha de Creación: {fechaCreacion || "Fecha no disponible"}</p>
        <p>
          Autor:
          {autor && autor.idUsuario ? (
            <Link to={`/usuario/perfil/${autor.idUsuario}`}>
              {autor.nombre || "Nombre no disponible"}
            </Link>
          ) : (
            "Información del autor no disponible"
          )}
        </p>
        <Comentarios devocionalId={devocional.id} usuarioId={autor.idUsuario} />
      </div>
    );
  };

  return (
    <div className="devocionales-container">
      <div className="devocionales">
        {usuarios.map((usuario) =>
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
