import { v4 as uuidv4 } from "uuid";
import { api } from "../src/services/api";

export const handlesend = async (message, sessionId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await api.post("/ai/chat", {
      sessionID: sessionId,
      userMessage: message,
      userId: user.id,
    });

    return {
      success: true,
      response: response.data.text,
      data: response.data.collectedData,
      type: response.data.type,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};

/* export const handlesend = async (message) => {
    if (sessionID === null) {
        sessionID = uuidv4();
    }
    try {
        const response = await axios.post('http://localhost:3000/ai/chat', {
            sessionID: sessionID,
            userMessage: message,
            token: localStorage.getItem('token')
        })


        return {
            success: true,
            response: response.data.text,
            data: response.data.collectedData
        }
    } catch (error) {

        return {
            success: false,
            error: error
        }
    }
} */
