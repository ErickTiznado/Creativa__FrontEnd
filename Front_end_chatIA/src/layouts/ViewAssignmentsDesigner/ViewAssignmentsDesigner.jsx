import Cards from '../../components/Cards/cards.jsx'
import Filter from '../../components/Filter/Filter.jsx'
import './ViewAssignmentsDesigner.css'
import { useState } from 'react';

function ViewAssignmentsDesigner() {
    const [filterMenu, setFilterMenu] = useState(false);

    const handleFilterClick = () => {
        setFilterMenu(!filterMenu);
    };

    return(
        <>
            <div className='container-ViewCampaignsMarketing'>

                <div className='header-ViewAssignmentsDesigner'>
                    <Filter onClick={handleFilterClick}/>
                    <div className='FilterMenu' style={{display: filterMenu ? 'flex' : 'none'}}>
                        <li>
                            <input type="checkbox" className="checkbox"/><label value="Todos">Todos</label>
                        </li>
                        <li>
                            <input type="checkbox" className="checkbox"/><label value="En proceso">En proceso</label>
                        </li>
                        <li>
                            <input type="checkbox" className="checkbox"/><label value="Aprobadas">Aprobadas</label>
                        </li>
                        <li>
                            <input type="checkbox" className="checkbox"/><label value="Rechazadas">Rechazadas</label>
                        </li>
                        <li>
                            <input type="checkbox" className="checkbox"/><label value="Canceladas">Canceladas</label>
                        </li>
                    </div>
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
                    </div>
                    <h3>Campañas rechazadas</h3>
                    <div className='cards-rechazadas'>
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
                    </div>
                </div>

            </div>
        </>
    );
}

export default ViewAssignmentsDesigner;