import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Comentarios from "./Comentarios";

export default function Devocional() {
  const { id } = useParams();
  const [devocional, setDevocional] = useState(null);

  useEffect(() => {
    const fetchDevocional = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/devocionales/${id}`);
        setDevocional(response.data);
      } catch (error) {
        console.error("Error al obtener el devocional:", error);
      }
    };

    fetchDevocional();
  }, [id]);

  if (!devocional) {
    return <p>Cargando devocional...</p>;
  }

  return (
    <div className="devocional-detalle">
      <h2>{devocional.nombre}</h2>
      <ReactQuill value={devocional.descripcion} readOnly={true} theme="snow" />
      <p>Vistas: {devocional.vistas}</p>
      <p>Autor: {devocional.autor?.nombre}</p>
      <Comentarios devocionalId={id} usuarioId={devocional.autor?.idUsuario} />
      {/* Aquí puedes agregar más detalles del devocional */}
    </div>
  );
}