import { api } from "../src/services/api";

/**
 * Send a message to the AI chat.
 * NOTE: Chat endpoints are not yet implemented in the hexagonal backend (Dev 3 pending).
 * Gracefully returns a message indicating the feature is unavailable.
 */
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
    // Graceful degradation if chat route doesn't exist yet
    if (error.response?.status === 404) {
      return {
        success: true,
        response: "El chat IA aún no está disponible en la nueva arquitectura. Estará disponible pronto.",
        data: null,
        type: "info",
      };
    }
    return {
      success: false,
      error: error,
    };
  }
};
