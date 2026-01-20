import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

let sessionID = null;
export let briefData = {};

export const handlesend = async (message) => {
    if (sessionID === null) {
        sessionID = uuidv4();
    }
    try {
        const response = await axios.post('http://localhost:3000/ai/chat', {
            sessionID: sessionID,
            userMessage: message
        })

        console.log('🔵 Respuesta completa de axios:', response);
        console.log('🔵 response.data:', response.data);
        console.log('🔵 response.data.collectedData:', response.data.collectedData);

        return {
            success: true,
            response: response.data.text,
            data: response.data.collectedData
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: error
        }
    }
}