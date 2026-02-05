import './Chatbox.css';
import ChatSection from './ChatSection';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { X } from 'lucide-react';



function Chatbox({ onClose }) {
    const [briefData, setBriefData] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [type, setType] = useState('');




    const handleBriefData = (newData) => {


        // Convertir objeto plano { key: value } a array de { label, value }
        setBriefData((prevBriefData) => {

            // Crear una copia del array actual
            const updatedData = [...prevBriefData];

            // Iterar sobre las nuevas claves del objeto
            Object.entries(newData).forEach(([key, value]) => {
                if (value && value !== "") {
                    // Buscar si ya existe ese label
                    const existingIndex = updatedData.findIndex(item => item.label === key);

                    if (existingIndex !== -1) {
                        // Actualizar valor existente
                        updatedData[existingIndex].value = value;
                    } else {
                        // Agregar nuevo item
                        updatedData.push({ label: key, value: value });
                    }
                }
            });

            return updatedData;
        });
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    return (
        <div className="chatbox-overlay">

            <div className="chatbox-container">
                <button className="close-btn" onClick={onClose}><X size={24} /></button>
                <div className="app-container">
                    <main className="main-layout">
                        <ChatSection onBriefData={handleBriefData} onToggleSidebar={toggleSidebar} onTypeChange={setType} />
                        <Sidebar
                            briefData={briefData}
                            className={isSidebarOpen ? 'open' : ''}
                            onToggle={toggleSidebar}
                            type={type}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Chatbox;
