import add from '../../assets/img/add.svg';
import './ButtonAdd.css';
function ButtonAdd() {
    return (
        <button className="ButtonAddContainer">
            <img src={add} alt="add" />
            Nueva Campaña
        </button>
    )
}
export default ButtonAdd;