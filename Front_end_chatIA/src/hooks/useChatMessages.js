import { useState, useCallback, useContext } from "react";
import { handlesend } from "../../functions/handlesend";
import sessionContext from "../context/SessionContextValue";
import { saveDraft } from "../services/draftService";
/**
 * Custom hook for managing chat messages state and operations.
 * Encapsulates message list, loading state, and send logic.
 *
 * @param {Function} onBriefData - Callback when brief data is received from the bot
 * @param {Array} initialMessages - Initial chat history to load
 * @returns {Object} Chat state and handlers
 */
export const useChatMessages = (onBriefData, initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [type, setType] = useState("");

  const { activeDraft, setActiveDraft } = useContext(sessionContext);

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

      // 1. Determine the Session ID to use (Existing or New)
      let currentSessionId = activeDraft;
      if (!currentSessionId) {
        currentSessionId = crypto.randomUUID();
        setActiveDraft(currentSessionId);
      }

      try {
        // 2. Send request to Backend with the Session ID
        const response = await handlesend(inputText, currentSessionId);
        setType(response.type);

        if (response.success) {
          const botMsg = {
            id: Date.now() + 1,
            sender: "bot",
            text: response.response,
          };

          const updatedMessages = [...messages, userMsg, botMsg];
          setMessages(updatedMessages);

          if (response.data && onBriefData) {
            onBriefData(response.data);
          }

          // 3. Save to LocalStorage (Persist the Draft)
          // Now we allow saveDraft to handle both create (upsert) and update
          saveDraft(
            currentSessionId,
            inputText,
            response.data,
            updatedMessages,
          );
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
    [inputText, onBriefData, activeDraft, setActiveDraft, messages],
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
