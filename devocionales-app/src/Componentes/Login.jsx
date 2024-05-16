import React from 'react'



export default function Login() {
  return (
    <form className='login'>
      <div>
        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="contrasenia">Contraseña:</label>
        <input
          type="password"
          id="contrasenia"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          required
        />
      </div>
    </form>  
  )
}
