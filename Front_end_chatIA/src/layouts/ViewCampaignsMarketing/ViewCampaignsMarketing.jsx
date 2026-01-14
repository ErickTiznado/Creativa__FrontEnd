import Navbar from '../../components/Navbar/Navbar.jsx'
import Cards from '../../components/Cards/cards.jsx'
import Filter from '../../components/Filter/Filter.jsx'
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd.jsx'
import './ViewCampaignsMarketing.css';
function ViewCampaignsMarketing() {
    return (
        <>
            <Navbar />
            <div className='container-ViewCampaignsMarketing'>
                <div className='header-ViewCampaignsMarketing'>
                    <ButtonAdd />
                    <Filter />
                </div>
                <div className='cards-ViewCampaignsMarketing'>
                    <h3>Campañas en aprobadas</h3>
                    <div className='cards-proceso'>
                        <Cards />
                        <Cards />
                        <Cards />
                        <Cards />
                    </div>
                    <h3>Campañas en proceso</h3>
                    <div className='cards-aprobadas'>
                        <Cards />
                        <Cards />
                        <Cards />
                        <Cards />
                    </div>
                    <h3>Campañas en rechazadas</h3>
                    <div className='cards-rechazadas'>
                        <Cards />
                        <Cards />
                        <Cards />
                        <Cards />
                    </div>
                    <h3>Campañas en canceladas</h3>
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
export default ViewCampaignsMarketing;