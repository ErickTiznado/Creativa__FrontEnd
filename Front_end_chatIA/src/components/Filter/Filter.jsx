import Filtro from '../../assets/img/filtro.png';
import './Filter.css';
function Filter({ onClick }) {
    return (
        <div className="FilterContainer" onClick={onClick}>
            <img src={Filtro} alt="Filtro"/>
        </div>
    );
}
export default Filter;