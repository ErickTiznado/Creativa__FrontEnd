import React, { useState, useEffect } from 'react';
import './RequestsMailbox.css';
import { Check, X, Calendar } from 'lucide-react';
import FadeIn from '../../components/animations/FadeIn';
import ScalePress from '../../components/animations/ScalePress';
import toast from 'react-hot-toast';
import { getRequests, updateRequestStatus } from '../../services/adminService';

const TYPE_LABELS = {
  password: 'Olvidó contraseña',
  email: 'Olvidó correo',
  both: 'Ambos',
};

const STATUS_LABELS = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
};

const RequestsMailbox = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getRequests();
      const data = response.data.data;
      setRequests(data);
      if (data.length > 0) {
        setSelectedRequest(data[0]);
        setAdminNotes(data[0].adminNotes || '');
      }
    } catch (error) {
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setAdminNotes(request.adminNotes || '');
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedRequest) return;
    try {
      await updateRequestStatus(selectedRequest.id, status, adminNotes);
      toast.success(status === 'accepted' ? 'Solicitud aceptada' : 'Solicitud rechazada');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar solicitud');
    }
  };

  const filteredRequests = requests.filter((r) =>
    !searchTerm ||
    r.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => dateStr ? dateStr.slice(0, 10) : '';

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
              <input
                type="text"
                placeholder="Buscar solicitudes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <p style={{ padding: '1rem', textAlign: 'center' }}>Cargando...</p>
            ) : filteredRequests.length === 0 ? (
              <p style={{ padding: '1rem', textAlign: 'center' }}>No hay solicitudes</p>
            ) : (
              <ul>
                {filteredRequests.map((request) => (
                  <li
                    key={request.id}
                    className={`request-item${selectedRequest?.id === request.id ? ' selected' : ''}`}
                    onClick={() => handleSelectRequest(request)}
                  >
                    <div className="meta">
                      <span className="name">{request.firstName} {request.lastName}</span>
                      <span className="type">{TYPE_LABELS[request.requestType] || request.requestType}</span>
                    </div>
                    <div className="right">
                      <span className="date"><Calendar size={14} /> {formatDate(request.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Panel de detalle */}
          <section className="request-detail">
            {!selectedRequest ? (
              <p style={{ padding: '2rem', textAlign: 'center' }}>Selecciona una solicitud</p>
            ) : (
              <>
                <div className="detail-header">
                  <div>
                    <h3>Solicitud de {selectedRequest.firstName} {selectedRequest.lastName}</h3>
                    <div className="small-meta">
                      <Calendar size={14} /> Enviada: {formatDate(selectedRequest.createdAt)}
                    </div>
                  </div>
                  {selectedRequest.status === 'pending' && (
                    <div className="detail-actions">
                      <ScalePress>
                        <button className="accept-btn" onClick={() => handleUpdateStatus('accepted')}>
                          <Check size={16} /> Aceptar
                        </button>
                      </ScalePress>
                      <ScalePress>
                        <button className="reject-btn" onClick={() => handleUpdateStatus('rejected')}>
                          <X size={16} /> Rechazar
                        </button>
                      </ScalePress>
                    </div>
                  )}
                  {selectedRequest.status !== 'pending' && (
                    <span className={`status-badge ${selectedRequest.status}`}>
                      {STATUS_LABELS[selectedRequest.status]}
                    </span>
                  )}
                </div>

                <div className="detail-body">
                  <p><strong>Tipo:</strong> {TYPE_LABELS[selectedRequest.requestType] || selectedRequest.requestType}</p>
                  <p><strong>Email:</strong> {selectedRequest.userEmail}</p>
                  <p><strong>Rol:</strong> {selectedRequest.role}</p>
                  {selectedRequest.message && (
                    <>
                      <p><strong>Mensaje:</strong></p>
                      <p className="message">{selectedRequest.message}</p>
                    </>
                  )}

                  <div className="admin-note">
                    <label>Notas del administrador</label>
                    <textarea
                      placeholder="Agrega observaciones..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      disabled={selectedRequest.status !== 'pending'}
                    />
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </FadeIn>
  );
};

export default RequestsMailbox;
