import React, { useEffect, useState } from "react";
import { conseguirDatos } from "../Servicios/devocionalServicio";
import { conseguirDatosBiblia } from "../Servicios/bibliaServicio";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Importa los estilos de ReactQuill
import axios from "axios";
import { Link } from "react-router-dom";
import Comentarios from "./Comentarios";

export default function Devocional() {
  const [devocionales, setDevocionales] = useState([]);
  const [devocionalExpandido, setDevocionalExpandido] = useState(null);
  const [bookAbbr, setBookAbbr] = useState("");
  const [bookName, setBookName] = useState("");
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [verseData, setVerseData] = useState(null);
  const [libros, setLibros] = useState([]);
  const [capitulos, setCapitulos] = useState([]);
  const [versiculos, setVersiculos] = useState([])

  const modules = {
    toolbar: false,
    clipboard: {
      matchVisual: false,
    },
  };

  useEffect(() => {
    const traerDatos = async () => {
      try {
        const datos = await conseguirDatos();
        setDevocionales(datos);
      } catch (error) {
        console.error("Error al traer los datos: ", error);
      }
    };
    traerDatos();
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

  return (
    <div className="devocionales-container">
      <div className="devocionales">
        {/* Renderiza tus devocionales aquí */}
        {devocionales.map((devocional) => (
          <div key={devocional.id} className="devocional">
            <h3
              className="titulo"
              onClick={() => toggleExpandido(devocional.id)}
              style={{ cursor: "pointer" }}
            >
              {devocional.nombre}
            </h3>
            {devocionalExpandido === devocional.id && (
              <div>
                <ReactQuill
                  theme="snow"
                  value={devocional.descripcion}
                  readOnly={true}
                  modules={modules}
                />  
                <p>Fecha de Creación: {devocional.fechaCreacion}</p>
                <p> Autor:
                <Link to = {`/usuario/perfil/${devocional.autor.idUsuario}`}> {devocional.autor.nombre} </Link>
                </p>
                
                <Comentarios devocionalId={devocional.id} />
              </div>
            )}
          </div>
        ))}
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
      <h3> Capitulo {chapter} Versículo {verse}</h3>{" "}
      {/* Muestra el número del versículo seleccionado */}
      {verseData.vers && verseData.vers[verse - 1] && (
        <div>
          <p>
            <strong>{verse}</strong>. {verseData.vers[verse - 1].verse}
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
