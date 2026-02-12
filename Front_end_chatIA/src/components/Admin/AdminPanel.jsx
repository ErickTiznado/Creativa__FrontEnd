import React from 'react';
import './AdminPanel.css';
import { UserPlus, Edit2, Trash2, Lock, Unlock  } from 'lucide-react';
import FadeIn from '../../components/animations/FadeIn';
import ScalePress from '../../components/animations/ScalePress';

const AdminPanel = () => {
  const onSubmit = (e) => {
    e.preventDefault(); // sólo para diseño: evitar recarga
  };

  return (
    <FadeIn className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <h2>Panel de Administración</h2>
        </div>

        <div className="admin-content">
          {/* Panel izquierdo: formulario (campos verticales) */}
          <div className="left-panel">
            <form className="admin-form" onSubmit={onSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="name">Firstname</label>
                  <input id="name" type="text" placeholder="Nombre" />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="lastname">Lastname</label>
                  <input id="lastname" type="text" placeholder="Apellido" />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="usuario@ejemplo.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input id="password" className="password-input" type="text" placeholder='••••••••' />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="role">Rol</label>
                  <select id="role" defaultValue="">
                    <option value="" disabled>Selecciona un rol</option>
                    <option value="marketing">Marketing</option>
                    <option value="designer">Diseñador</option>
                    
                  </select>
                </div>
              </div>

              <ScalePress>
                <div className="create-button-wrap">
                  <button type="submit" className="create-button">
                    <UserPlus size={16} style={{ marginRight: 8 }} />
                    Crear Usuario
                  </button>
                </div>
              </ScalePress>
            </form>
          </div>

          {/* Panel derecho: tabla de usuarios */}
          <div className="right-panel">
            <div className="admin-table-section">
              <div className="table-header-row">
                <h3>Users</h3>
                <div className="user-controls">
                  <input className="user-search" type="text" placeholder="Buscar usuario..." />
                  <select className="role-filter" defaultValue="">
                    <option value="">Filtrar por rol</option>
                    <option value="marketing">Marketing</option>
                    <option value="designer">Diseñador</option>
                     <option value="lock">Deshabilitados</option>
                  </select>
                </div>
              </div>

              <div className="table-wrapper">
                {/* tabla solo con el thead */}
                <table className="admin-table head-table" aria-hidden="true">
                  <thead>
                    <tr>
                      <th>Firstname</th>
                      <th>Lastname</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th className="actions-col">Shares</th>
                    </tr>
                  </thead>
                </table>

                {/* cuerpo de la tabla: scroll independiente */}
                <div className="table-body-scroll">
                  <table className="admin-table body-table">
                    <tbody>
                      {/* Filas de ejemplo para mostrar diseño (sin funcionalidad) */}
                      <tr>
                        <td>María</td>
                        <td>Lopez</td>
                        <td>maria@ejemplo.com</td>
                        <td><span className="role-badge marketing">Marketing</span></td>
                        <td className="actions-col">
                        
                          <button className="icon-btn edit" title='Editar usuario'><Edit2 size={16} /></button>
                          <button className="icon-btn delete" title='Eliminar usuario'><Trash2 size={16} /></button>
                          {/* boton adicional de desabilitar */}
                           <button className="icon-btn disable" title='deshabilitar usuario'><Unlock size={16} /></button>
                        </td>
                      </tr>

                      <tr>
                        <td>Andrés</td>
                        <td>Ruiz</td>
                        <td>andres@ejemplo.com</td>
                        <td><span className="role-badge designer">Diseñador</span></td>
                        <td className="actions-col">
                           <button className="icon-btn edit" title='Editar usuario'><Edit2 size={16} /></button>
                          <button className="icon-btn delete" title='Eliminar usuario'><Trash2 size={16} /></button>
                           <button className="icon-btn disable" title='deshabilitar usuario'><Unlock size={16} /></button>
                        </td>
                      </tr>
                      <tr className="disabled-row">
                        <td>Andrés</td>
                        <td>Ruiz</td>
                        <td>andres@ejemplo.com</td>
                        <td><span className="role-badge designer">Diseñador</span></td>
                        <td className="actions-col">
                          <button className="icon-btn edit" title="Editar usuario" disabled aria-disabled="true"><Edit2 size={16} /></button>
                          <button className="icon-btn delete" title="Eliminar usuario" disabled aria-disabled="true"><Trash2 size={16} /></button>
                          {/* Sólo habilitado el botón de bloqueo/desbloqueo */}
                          <button className="icon-btn disable" title="Habilitar usuario"><Unlock size={16} /></button>
                        </td>
                      </tr>
                      
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default AdminPanel;
