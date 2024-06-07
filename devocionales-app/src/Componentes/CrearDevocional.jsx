import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

export default function CrearDevocional() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();;

    const URL = "http://localhost:8080/devocionales/registro";

    try {
      const fechaActual = new Date();
      const response = await axios.post(URL, {
        nombre,
        descripcion,
        fechaCreacion: fechaActual
      }, {
        withCredentials: true
      });
      console.log("Respuesta del servidor: ", response.data);
      navigate("/")
    } catch (error) {
      console.log("Se ha producido un error al cargar el Devocional: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="descripcion">Descripcion:</label>
        <ReactQuill
          theme="snow"
          value={descripcion}
          onChange={(value) => setDescripcion(value)}
          required
        />
      </div>
      <div>
        <label htmlFor="nombre">Guardar Como:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          required
        />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
}
