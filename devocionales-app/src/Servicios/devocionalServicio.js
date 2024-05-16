import axios from 'axios';

const URL = "http://localhost:8080/devocionales"

export const conseguirDatos = async () => {
    //Respuesta de los datos de la url
    const response = await axios.get(URL)
    //Trae los datos de la respuesta
    const data = response.data

    return data;
}

export const publicarDatos = async () => {
    try {
        const response = await axios.post(URL)
        return response.data
    }
    catch(error) {
        console.error("Hubo un error al publicar la tarea: ", error)
        throw error
    }
}