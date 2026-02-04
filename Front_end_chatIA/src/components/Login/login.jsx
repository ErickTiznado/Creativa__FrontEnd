import React from 'react';
import './Login.css';
import { useAuth } from '../../hooks/useAuth';
/**importar react icons */
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Logo_CS from '../../assets/img/logo_CS.png';
import FadeIn from '../../components/animations/FadeIn';
import ScalePress from '../../components/animations/ScalePress';

const Login = () => {

  const { login } = useAuth()


  const onSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const response = await login(email, password);

      if (response?.role === "marketing") {
        window.location.href = '/';
      } if (response?.role === "designer") {
        window.location.href = '/designer';
      }
    } catch (error) {

    }
  }
  return (
    <FadeIn className="login-container">
      <div className="login-card">

        {/* Cabecera del Login */}
        <div className="login-header">
          <img className="login-logo" src={Logo_CS} alt="Creativa Studios Logo" />
          <p>Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={onSubmit}>

          {/* Campo Email */}
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon"><Mail size={20} /></span>
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
              <span className="input-icon"><Lock size={20} /></span>
              <input type="password" id="password" placeholder="••••••••" />
              {/* Icono de ojo para mostrar/ocultar contraseña */}
              <div style={{ marginBottom: '20px' }} className='eye-password-toggle'>
                <span onClick={togglePasswordVisibility} className="input-icon eye-icon"><Eye size={20} /></span>
                <span onClick={togglePasswordVisibility} className="input-icon eye-icon-slash"><EyeOff size={20} /></span>
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

          <ScalePress>
           <div className='button-container'>
             <button type="submit" className="login-button">
              Iniciar Sesión
            </button>
           </div>
          </ScalePress>
        </form>

        <div className="login-footer">
          <p>¿Necesitas recuperar tu cuenta? <a href="#">Recuperar ahora</a></p>
        </div>
      </div>
    </FadeIn>
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