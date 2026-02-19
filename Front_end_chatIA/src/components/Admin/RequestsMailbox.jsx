import React from 'react';
import './RequestsMailbox.css';
import { Mail, Check, X, Calendar } from 'lucide-react';
import FadeIn from '../../components/animations/FadeIn';
import ScalePress from '../../components/animations/ScalePress';

const RequestsMailbox = () => {
  return (
    <FadeIn className="requests-container">
      <div className="requests-card">
        <div className="requests-header">
          <h2>Buzón de solicitudes</h2>
          <p>Revisa y gestiona las solicitudes de recuperación de cuenta</p>
        </div>

        <div className="requests-content">
          {/* Lista de solicitudes */}
          <aside className="requests-list">
            <div className="list-search">
              <input type="text" placeholder="Buscar solicitudes..." />
            </div>

            <ul>
              <li className="request-item selected">
                <div className="meta">
                  <span className="name">María López</span>
                  <span className="type">Olvidó contraseña</span>
                </div>
                <div className="right">
                  <span className="date"><Calendar size={14} /> 2026-02-11</span>
                </div>
              </li>

              <li className="request-item">
                <div className="meta">
                  <span className="name">Andrés Ruiz</span>
                  <span className="type">Olvidó correo</span>
                </div>
                <div className="right">
                  <span className="date"><Calendar size={14} /> 2026-02-09</span>
                </div>
              </li>

              <li className="request-item">
                <div className="meta">
                  <span className="name">Lucía Pérez</span>
                  <span className="type">Ambos</span>
                </div>
                <div className="right">
                  <span className="date"><Calendar size={14} /> 2026-01-30</span>
                </div>
              </li>

              {/* ... filas de ejemplo ... */}
              <li className="request-item">
                <div className="meta">
                  <span className="name">Lucía Pérez</span>
                  <span className="type">Ambos</span>
                </div>
                <div className="right">
                  <span className="date"><Calendar size={14} /> 2026-01-30</span>
                </div>
              </li>
              <li className="request-item">
                <div className="meta">
                  <span className="name">Lucía Pérez</span>
                  <span className="type">Ambos</span>
                </div>
                <div className="right">
                  <span className="date"><Calendar size={14} /> 2026-01-30</span>
                </div>
              </li>
              <li className="request-item">
                <div className="meta">
                  <span className="name">Lucía Pérez</span>
                  <span className="type">Ambos</span>
                </div>
                <div className="right">
                  <span className="date"><Calendar size={14} /> 2026-01-30</span>
                </div>
              </li>
              <li className="request-item">
                <div className="meta">
                  <span className="name">Lucía Pérez</span>
                  <span className="type">Ambos</span>
                </div>
                <div className="right">
                  <span className="date"><Calendar size={14} /> 2026-01-30</span>
                </div>
              </li>
            </ul>
          </aside>

          {/* Panel de detalle */}
          <section className="request-detail">
            <div className="detail-header">
              <div>
                <h3>Solicitud de María López</h3>
                <div className="small-meta"><Calendar size={14} /> Enviada: 2026-02-11</div>
              </div>
              <div className="detail-actions">
                <ScalePress><button className="accept-btn"><Check size={16} /> Aceptar</button></ScalePress>
                <ScalePress><button className="reject-btn"><X size={16} /> Rechazar</button></ScalePress>
              </div>
            </div>

            <div className="detail-body">
              <p><strong>Tipo:</strong> Olvidó contraseña</p>
              <p><strong>Email:</strong> maria@ejemplo.com</p>
              <p><strong>Rol:</strong> Marketing</p>
              <p><strong>Mensaje:</strong></p>
              <p className="message">Hola, no puedo acceder a mi cuenta desde ayer. Creo que olvidé mi contraseña. Gracias por ayudarme.</p>

              <div className="admin-note">
                <label>Notas del administrador</label>
                <textarea placeholder="Agrega observaciones..."></textarea>
              </div>
            </div>
          </section>
        </div>
      </div>
    </FadeIn>
  );
};

export default RequestsMailbox;
