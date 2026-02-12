import React from 'react';
import './RecoverAccount.css';
import FadeIn from '../components/animations/FadeIn';
import ScalePress from '../components/animations/ScalePress';

const RecoverAccount = () => {
  const onSubmit = (e) => {
    e.preventDefault(); // sólo diseño
  };

  return (
    <FadeIn className="recover-container">
      <div className="recover-card">
        <div className="recover-header">
          <h2>Recuperar cuenta</h2>
          <p>Si olvidaste tu correo o contraseña, solicita al administrador la recuperación. Completa el formulario y especifica tu caso.</p>
        </div>

        <form className="recover-form" onSubmit={onSubmit}>
          <div className="recover-row">
            <label className="option-inline">
              <input type="radio" name="recoverType" defaultChecked />
              Olvidé mi contraseña
            </label>
            <label className="option-inline">
              <input type="radio" name="recoverType" />
              Olvidé mi correo
            </label>
            <label className="option-inline">
              <input type="radio" name="recoverType" />
              Ambos (correo y contraseña)
            </label>
          </div>
          <div className="recover-row">
            <label htmlFor="rec-name">Nombre</label>
            <input id="rec-name" type="text" placeholder="Escribe tu nombre" />
          </div>

          <div className="recover-row">
            <label htmlFor="rec-email">Correo (para enviarte la confirmacion de recuperación)</label>
            <input id="rec-email" type="email" placeholder="usuario@ejemplo.com" />
          </div>
           <div className="recover-row">
            <label htmlFor="rec-role">Rol</label>
            <input id="rec-role" type="text" placeholder="Cual era tu rol?" />
          </div>

          <div className="recover-row">
            <label htmlFor="rec-message">Detalles / Motivo</label>
            <textarea id="rec-message" rows="4" placeholder="Describe tu problema, el nombre real de la cuenta o cualquier dato que ayude al administrador..."></textarea>
          </div>

          <ScalePress>
            <div className="recover-actions">
              <button type="submit" className="primary-btn">Solicitar recuperación</button>
              <a className="link-back" href="/login">Volver al inicio de sesión</a>
            </div>
          </ScalePress>
        </form>

      </div>
    </FadeIn>
  );
};

export default RecoverAccount;
