import axios from "axios";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router";


export default function ModificarDevocional() {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate(); // Obtener el objeto de historial

  const handleSubmit = async (e) => {
    e.preventDefault();

    const URL = `http://localhost:8080/devocionales/modificar/${id}`;

    try {
      const response = await axios.put(URL, {
        nombre,
        descripcion,
      });
      console.log("Respuesta del servidor: ", response.data);
      // Redirigir a la ruta "/"
      navigate("/");
    } catch (error) {
      console.log("Se ha producido un error al cargar el Devocional: ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p> {id} </p>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="descripcion">Descripcion:</label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
