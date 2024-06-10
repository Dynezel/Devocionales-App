import React, { useEffect, useState } from "react";
import { conseguirDatos } from "../Servicios/devocionalServicio";
import axios from "axios";

export default function Prueba() {
  const [devocionales, setDevocionales] = useState([]);
  const [data, setData] = useState()

  useEffect(() => {
    const traerDatos = async () => {
      try {
        const datos = await conseguirDatos();
        console.log("Datos recibidos:", datos);
        setDevocionales(datos);
      } catch (error) {
        console.error("Error al traer los datos: ", error);
      }
    };
    traerDatos();
  }, []);

  return (
  <div>
    {devocionales.map((devocional) => {
            <div key={devocional.id} className="devocional">
                <p> {devocional.descripcion} </p>
            </div>
        })}
  </div>
  )
}