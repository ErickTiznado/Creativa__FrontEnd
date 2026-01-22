import Cards from '../../components/Cards/cards.jsx'
import './ViewAssignmentsDesigner.css'

// Componente presentacional independiente para la vista Designer (sin funcionalidad ni toggle)
const DesignerFilter = () => {
    return (
        <div className="designer-filter" role="region" aria-label="Filtro diseñador">
            <div className="designer-filter-left">
                <strong className="designer-filter-title">Filtro</strong>
            </div>
            <ul className="designer-filter-list">
                <li><input id="df-all" type="checkbox" /><label htmlFor="df-all">Todos</label></li>
                <li><input id="df-inprocess" type="checkbox" /><label htmlFor="df-inprocess">En proceso</label></li>
                <li><input id="df-approved" type="checkbox" /><label htmlFor="df-approved">Aprobadas</label></li>
                <li><input id="df-rejected" type="checkbox" /><label htmlFor="df-rejected">Rechazadas</label></li>
                <li><input id="df-cancelled" type="checkbox" /><label htmlFor="df-cancelled">Canceladas</label></li>
            </ul>
            <div className="designer-filter-actions">
                <button className="df-btn df-btn-clear" type="button">Limpiar</button>
                <button className="df-btn df-btn-apply" type="button">Aplicar</button>
            </div>
        </div>
    );
}

function ViewAssignmentsDesigner() {
    // El filtro siempre está visible en esta vista (sin state)

    return(
        <>
            <div className='container-ViewCampaignsMarketing'>

                <div className='header-ViewAssignmentsDesigner'>
                    {/* Filtro independiente (presentacional) para vista Designer */}
                    <DesignerFilter />
                </div>
                
                <div className="cardsViewCampaignsMarketing">
                    <h3>Asignaciones</h3>
                    <div className="cards-proceso">
                        <Cards />
                    </div>
                    <h3>Campañas aprobadas</h3>
                    <div className='cards-aprobadas'>
                        <Cards />
                        <Cards />
                        <Cards />
                        <Cards />
                        <Cards />
                    </div>
                    <h3>Campañas rechazadas</h3>
                    <div className='cards-rechazadas'>
                        <Cards />
                        <Cards />
                        <Cards />
                        <Cards />
                        <Cards />
                    </div>
                    <h3>Campañas canceladas</h3>
                    <div className='cards-canceladas'>
                        <Cards />
                        <Cards />
                        <Cards />
                        <Cards />
                        <Cards />
                    </div>
                </div>

            </div>
        </>
    );
}

export default ViewAssignmentsDesigner;