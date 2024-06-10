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
import Login from './Componentes/Login'
import Welcome from './Componentes/Welcome'
import Perfil from './Componentes/Perfil'
import PerfilUsuario from './Componentes/PerfilUsuario'
import Prueba from './Componentes/Prueba'


function App() {

  return (
    <>
      <BrowserRouter>
      <NavBar/>
      <Routes>
      <Route path="/" element={<Devocionales />} />
      <Route path="/prueba" element={<Prueba />} />
      <Route path="/devocionales/crear" element={<CrearDevocional />} />
      <Route path="/devocionales/modificar/:id" element= { <ModificarDevocional/> } />
      <Route path="/devocionales/eliminar/:id" element= { <EliminarDevocional/> } />
      <Route path="/usuario/registro" element= { <RegistrarUsuario/> } />
      <Route path="/usuario/perfil" element={<Perfil/>} />
      <Route path="/usuario/perfil/:idUsuario" element={<PerfilUsuario/>} />
      <Route path="/login" element= { <Login/> } />
      </Routes>
      <Footer/>
      </BrowserRouter>
      
    </>  
  )
}

export default App