import { useState, useCallback } from "react";
import { handlesend } from "../../functions/handlesend";

/**
 * Custom hook for managing chat messages state and operations.
 * Encapsulates message list, loading state, and send logic.
 *
 * @param {Function} onBriefData - Callback when brief data is received from the bot
 * @returns {Object} Chat state and handlers
 */
export const useChatMessages = (onBriefData) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [type, setType] = useState("");

  const handleInputChange = useCallback((e) => {
    setInputText(e.target.value);
  }, []);

  const sendMessage = useCallback(
    async (e) => {
      e?.preventDefault();

      if (inputText.trim() === "") return;

      const userMsg = { id: Date.now(), sender: "user", text: inputText };
      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
      setIsLoading(true);

      try {
        const response = await handlesend(inputText);
        setType(response.type);

        if (response.success) {
          const botMsg = {
            id: Date.now() + 1,
            sender: "bot",
            text: response.response,
          };
          setMessages((prev) => [...prev, botMsg]);

          if (response.data && onBriefData) {
            onBriefData(response.data);
          }
        } else {
          const botMsg = {
            id: Date.now() + 1,
            sender: "bot",
            text: "Error al procesar la solicitud",
          };
          setMessages((prev) => [...prev, botMsg]);
        }
      } catch (error) {
        console.error("Error en sendMessage:", error);
        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text: "Error de conexión. Intenta de nuevo.",
        };
        setMessages((prev) => [...prev, botMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputText, onBriefData],
  );

  return {
    messages,
    isLoading,
    inputText,
    type,
    handleInputChange,
    sendMessage,
  };
};
