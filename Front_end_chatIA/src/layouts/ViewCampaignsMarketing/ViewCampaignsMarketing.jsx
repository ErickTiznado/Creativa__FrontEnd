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
                    <Filter onClick={handleFilterClick} />
                    <div className='FilterMenu' style={{ display: filterMenu ? 'flex' : 'none' }}>
                        <li>
                            <input type="checkbox" className="checkbox" /><label value="En proceso">En proceso</label>
                        </li>
                        <li>
                            <input type="checkbox" className="checkbox" /><label value="Aprobadas">Aprobadas</label>
                        </li>
                        <li>
                            <input type="checkbox" className="checkbox" /><label value="Rechazadas">Rechazadas</label>
                        </li>
                        <li>
                            <input type="checkbox" className="checkbox" /><label value="Canceladas">Canceladas</label>
                        </li>
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