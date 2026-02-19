import React, { useState } from 'react';
import './AdminPanel.css';
import { UserPlus, Edit2, Trash2, Lock, Unlock  } from 'lucide-react';
import FadeIn from '../../components/animations/FadeIn';
import ScalePress from '../../components/animations/ScalePress'


const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: '',
};

const sampleUsers = [
  {
    id: 'u1',
    firstName: 'Maria',
    lastName: 'Lopez',
    email: 'maria@ejemplo.com',
    role: 'marketing',
    password: '••••••••',
  },
  {
    id: 'u2',
    firstName: 'Andres',
    lastName: 'Ruiz',
    email: 'andres@ejemplo.com',
    role: 'designer',
    password: '••••••••',
  },
  {
    id: 'u3',
    firstName: 'Andres',
    lastName: 'Ruiz',
    email: 'andres@ejemplo.com',
    role: 'designer',
    password: '••••••••',
    isDisabled: true,
  },
];

const AdminPanel = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault(); // sólo para diseño: evitar recarga
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditUser = (user) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setIsEditing(false);
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
            <form className={`admin-form ${isEditing ? 'editing' : ''}`} onSubmit={onSubmit}>
              {isEditing && (
                <div className="edit-mode-banner">
                  Editando usuario
                </div>
              )}
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="name">Firstname</label>
                  <input
                    id="name"
                    name="firstName"
                    type="text"
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="lastname">Lastname</label>
                  <input
                    id="lastname"
                    name="lastName"
                    type="text"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    className="password-input"
                    type="text"
                    placeholder='••••••••'
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="role">Rol</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Selecciona un rol</option>
                    <option value="marketing">Marketing</option>
                    <option value="designer">Diseñador</option>
                    
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <ScalePress>
                  <div className="create-button-wrap">
                    <button type="submit" className="create-button">
                      <UserPlus size={16} style={{ marginRight: 8 }} />
                      {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                    </button>
                  </div>
                </ScalePress>
                {isEditing && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </button>
                )}
              </div>
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
                      {sampleUsers.map((user) => (
                        <tr key={user.id} className={user.isDisabled ? 'disabled-row' : undefined}>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role === 'marketing' ? 'Marketing' : 'Diseñador'}
                            </span>
                          </td>
                          <td className="actions-col">
                            <button
                              type="button"
                              className="icon-btn edit"
                              title="Editar usuario"
                              onClick={() => handleEditUser(user)}
                              disabled={user.isDisabled}
                              aria-disabled={user.isDisabled ? 'true' : 'false'}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn delete"
                              title="Eliminar usuario"
                              disabled={user.isDisabled}
                              aria-disabled={user.isDisabled ? 'true' : 'false'}
                            >
                              <Trash2 size={16} />
                            </button>
                            {/* boton adicional de desabilitar */}
                            <button
                              type="button"
                              className="icon-btn disable"
                              title={user.isDisabled ? 'Habilitar usuario' : 'deshabilitar usuario'}
                            >
                              <Unlock size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      
                      
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
