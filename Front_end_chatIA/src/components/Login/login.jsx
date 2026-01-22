import React from 'react';
import './Login.css';
import { useAuth } from '../../hooks/useAuth';
/**importar react icons */
import { FaEnvelope, FaLock, } from 'react-icons/fa';
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";
import Logo_CS from '../../assets/img/logo_CS.png';

const Login = () => {

  const login = useAuth()

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Cabecera del Login */}
        <div className="login-header">
          <img className="login-logo" src={Logo_CS} alt="Creativa Studios Logo" />
          <p>Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>

          {/* Campo Email */}
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon"><FaEnvelope /></span>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon"><FaLock /></span>
              <input type="password" id="password" placeholder="••••••••" />
              {/* Icono de ojo para mostrar/ocultar contraseña */}
              <div style={{ marginBottom: '20px' }} className='eye-password-toggle'>
                <span onClick={togglePasswordVisibility} className="input-icon eye-icon"><LiaEyeSolid /></span>
                <span onClick={togglePasswordVisibility} className="input-icon eye-icon-slash"><LiaEyeSlashSolid /></span>
              </div>

            </div>
          </div>

          {/* Acciones secundarias */}
          <div className="form-actions">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Recuérdame</span>
            </label>
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-footer">
          <p>¿Necesitas recuperar tu cuenta? <a href="#">Recuperar ahora</a></p>
        </div>
      </div>
    </div>
  );
};

/**funcionalidad de mostrar y ocultar contraseña */
const togglePasswordVisibility = () => {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.querySelector('.eye-icon');
  const eyeIconSlash = document.querySelector('.eye-icon-slash');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.style.display = 'none';
    eyeIconSlash.style.display = 'inline';
  } else {
    passwordInput.type = 'password';
    eyeIcon.style.display = 'inline';
    eyeIconSlash.style.display = 'none';
  }
};

export default Login;