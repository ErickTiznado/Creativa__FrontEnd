import { ListFilter } from 'lucide-react';
import './Filter.css';
function Filter({ onClick }) {
    return (
        <div className="FilterContainer" onClick={onClick}>
            <ListFilter size={24} />
        </div>
    );
}
export default Filter;