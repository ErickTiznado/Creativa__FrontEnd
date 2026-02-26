import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../hooks/useAuth';
/**importar react icons */
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Logo_CS from '../../assets/img/logo_CS.png';
import FadeIn from '../../components/animations/FadeIn';
import ScalePress from '../../components/animations/ScalePress';

const Login = () => {

  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await login(email, password);

      // Chivato en consola para que veas qué datos trae realmente
      console.log("Datos del usuario logueado:", response);

      // Buscamos el rol donde Supabase lo esconde (user_metadata) o en el rol principal
      const userRole = response?.user_metadata?.role || response?.role;

      if (userRole === "marketing") {
        window.location.href = '/';
      } else if (userRole === "designer") {
        window.location.href = '/designer';
      } else if (userRole === "admin") {
        window.location.href = '/admin';
      } else {
        // SALVACAÍDAS: Si por alguna razón el rol es distinto o no viene, te manda al inicio.
        console.warn("Rol no detectado o distinto, redirigiendo al home por defecto");
        window.location.href = '/';
      }

    } catch (error) {
      // Importante imprimir el error si falla la contraseña
      console.error("Error atrapado en el componente Login:", error);
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
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
              />
              {/* Icono de ojo para mostrar/ocultar contraseña */}
              <div style={{ marginBottom: '20px', cursor: 'pointer' }} className='eye-password-toggle' onClick={() => setShowPassword(!showPassword)}>
                <span className="input-icon eye-icon">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
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
          <p>¿Necesitas recuperar tu cuenta? <a href="/recover">Recuperar ahora</a></p>
        </div>
      </div>
    </FadeIn>
  );
};

export default Login;