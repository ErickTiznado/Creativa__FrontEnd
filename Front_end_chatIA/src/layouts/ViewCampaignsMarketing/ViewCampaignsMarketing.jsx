import Cards from '../../components/Cards/cards.jsx'
import Filter from '../../components/Filter/Filter.jsx'
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd.jsx'
import './ViewCampaignsMarketing.css';
import { useState, useEffect } from 'react';
import { handleGetCampaigns } from "../../../functions/handlegetCampaigns.js"




function ViewCampaignsMarketing() {
    const [campaigns, setCampaigns] = useState([])
    const [filterMenu, setFilterMenu] = useState(false);
    const handleFilterClick = () => {
        setFilterMenu(!filterMenu);
    };

    useEffect(() => {
        const getCampaigns = async () => {
            try {
                const result = await handleGetCampaigns()
                if (result.success) {
                    setCampaigns(result.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getCampaigns()
    }, [])

    const staus = {
        draft: "En Proceso",
        approved: "Aprobado",
        rejected: "Rechazado",
        cancelled: "Cancelado"
    }
    const draft = campaigns.filter(c => c.status === "draft")
    const approved = campaigns.filter(c => c.status === "approved")
    const rejected = campaigns.filter(c => c.status === "rejected")
    const cancelled = campaigns.filter(c => c.status === "cancelled")


    return (
        <>
            <div className='container-ViewCampaignsMarketing'>
                <div className='header-ViewCampaignsMarketing'>
                    <ButtonAdd />

                    {/* Wrapper del filtro para posicionamiento */}
                    <div className="filter-wrapper">
                        <Filter onClick={handleFilterClick} />

                        {/* Menú de filtro mejorado */}
                        <div className={`filter-menu ${filterMenu ? 'open' : ''}`} role="menu" aria-hidden={!filterMenu}>
                            <div className="filter-menu-inner">
                                <div className="filter-header">
                                    <strong>Filtrar por estado</strong>
                                    <button className="filter-close" onClick={handleFilterClick} aria-label="Cerrar filtro">×</button>
                                </div>

                                <ul className="filter-list">
                                    <li>
                                        <input id="f-in-process" type="checkbox" className="checkbox" />
                                        <label htmlFor="f-in-process">En proceso</label>
                                    </li>
                                    <li>
                                        <input id="f-approved" type="checkbox" className="checkbox" />
                                        <label htmlFor="f-approved">Aprobadas</label>
                                    </li>
                                    <li>
                                        <input id="f-rejected" type="checkbox" className="checkbox" />
                                        <label htmlFor="f-rejected">Rechazadas</label>
                                    </li>
                                    <li>
                                        <input id="f-cancelled" type="checkbox" className="checkbox" />
                                        <label htmlFor="f-cancelled">Canceladas</label>
                                    </li>
                                </ul>

                                <div className="filter-actions">
                                    <button className="btn-clear" onClick={() => { /* limpiar checks (implementar si se desea) */ }}>Limpiar</button>
                                    <button className="btn-apply" onClick={() => setFilterMenu(false)}>Aplicar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="section-divider"></div>
                <div className='cards-ViewCampaignsMarketing'>
                    <h3>Campañas en proceso</h3>
                    <div className='cards-proceso'>
                        {
                            draft.map((c, index) => {
                                return <Cards key={index} titulo={c.brief_data.nombre_campaing} estado={staus[`${c.status}`]} fecha={c.brief_data.fechaPublicacion} />
                            })
                        }
                    </div>
                    <div className="section-divider"></div>
                    <h3>Campañas aprobadas</h3>
                    <div className='cards-aprobadas'>
                        {
                            approved.map((c, index) => {
                                return <Cards key={index} titulo={c.brief_data.nombre_campaing} estado={staus[`${c.status}`]} fecha={c.brief_data.fechaPublicacion} />
                            })
                        }
                    </div>
                    <div className="section-divider"></div>
                    <h3>Campañas rechazadas</h3>
                    <div className='cards-rechazadas'>
                        {
                            rejected.map((c, index) => {
                                return <Cards key={index} titulo={c.brief_data.nombre_campaing} estado={staus[`${c.status}`]} fecha={c.brief_data.fechaPublicacion} />
                            })
                        }
                    </div>
                    <div className="section-divider"></div>
                    <h3>Campañas canceladas</h3>
                    <div className='cards-canceladas'>
                        {
                            cancelled.map((c, index) => {
                                return <Cards key={index} titulo={c.brief_data.nombre_campaing} estado={staus[`${c.status}`]} fecha={c.brief_data.fechaPublicacion} />
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewCampaignsMarketing;