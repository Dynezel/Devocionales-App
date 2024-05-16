import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './Componentes/NavBar'
import Footer from './Componentes/Footer'
import Devocionales from './Componentes/Devocionales'
import EliminarDevocional from './Componentes/EliminarDevocional'
import CrearDevocional from './Componentes/CrearDevocional'
import ModificarDevocional from './Componentes/ModificarDevocional'
import RegistrarUsuario from './Componentes/RegistrarUsuario'


function App() {

  return (
    <>
      <BrowserRouter>
      <NavBar/>
      <Routes>
      <Route path="/" element={<Devocionales />} />
      <Route path="/devocionales/crear" element={<CrearDevocional />} />
      <Route path="/devocionales/modificar/:id" element= { <ModificarDevocional/> } />
      <Route path="/devocionales/eliminar/:id" element= { <EliminarDevocional/> } />
      <Route path="/usuario/registro" element= { <RegistrarUsuario/> } />
      </Routes>
      <Footer/>
      </BrowserRouter>
      
    </>  
  )
}

export default App