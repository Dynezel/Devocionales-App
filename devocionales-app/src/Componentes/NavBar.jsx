import React from 'react'
import LogoImg from "../Images/buscasitasGold.png"
import { Link } from 'react-router-dom'


export default function NavBar() {
  return (
    <header className='header'>
        <Link className='icon' to={"/"} > <img src= {LogoImg} alt='Logo' />
        </Link>
        <nav className='links'>

            <Link to = {"/usuario/registrar"}>
              Registrate
            </Link>

            <Link to = {"/usuario/login"}>
              Inicia Sesion
            </Link>

            <Link to = {"/devocionales"}> 
            Devocionales
            </Link>

            <Link to = {"/devocionales/crear"}>
              Crear Devocional
            </Link>
        </nav>
    </header>
  )
}
