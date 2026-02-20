import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { handlesend } from "../../functions/handlesend";
import sessionContext from "../context/SessionContextValue";
import { saveDraft } from "../services/draftService";
import { updateChatSession } from "../services/chatService";

export const useChatMessages = (onBriefData, initialMessages = []) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [type, setType] = useState("");

  const { activeDraft, setActiveDraft } = useContext(sessionContext);
  const hasLoadedHistory = useRef(false);

  useEffect(() => {
    if (!activeDraft) {
      setMessages([]);
      hasLoadedHistory.current = false;
    }
  }, [activeDraft]);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0 && !hasLoadedHistory.current) {
      setMessages(initialMessages);
      hasLoadedHistory.current = true;
    }
  }, [initialMessages]);

  const handleInputChange = useCallback((e) => {
    setInputText(e.target.value);
  }, []);

  const sendMessage = useCallback(
    async (e) => {
      e?.preventDefault();

      if (inputText.trim() === "") return;

      const userMsg = { id: Date.now(), sender: "user", text: inputText };

      // Actualizamos el estado de los mensajes inmediatamente para que se vea fluido
      const currentMessages = [...messages, userMsg];
      setMessages(currentMessages);
      setInputText("");
      setIsLoading(true);

      let currentSessionId = activeDraft;
      if (!currentSessionId) {
        currentSessionId = crypto.randomUUID();
        setActiveDraft(currentSessionId);
      }

      try {
        const response = await handlesend(inputText, currentSessionId);
        setType(response.type);

        if (response.success) {
          const botMsg = {
            id: Date.now() + 1,
            sender: "bot",
            text: response.response,
          };

          const finalMessages = [...currentMessages, botMsg];
          setMessages(finalMessages);

          if (response.data && onBriefData) {
            onBriefData(response.data);
          }

          // 1. Guardamos en LocalStorage (como siempre)
          saveDraft(
            currentSessionId,
            inputText,
            response.data,
            finalMessages,
          );

          // 2. EL FIX MÁGICO: Guardamos en Supabase en tiempo real
          try {
            // Formateamos los mensajes al estilo que espera la IA/Supabase
            const formattedForDB = finalMessages.map(msg => ({
              role: msg.sender === 'bot' ? 'model' : 'user',
              parts: [{ text: msg.text }]
            }));

            await updateChatSession(currentSessionId, {
              chat: {
                message: formattedForDB,
                data: response.data || {}
              }
            });
            console.log("💾 [Hook] Mensajes guardados en Supabase.");
          } catch (dbError) {
            console.error("❌ [Hook] Error guardando en Supabase en tiempo real:", dbError);
          }

        } else {
          const botMsg = {
            id: Date.now() + 1,
            sender: "bot",
            text: "Error al procesar la solicitud",
          };
          setMessages([...currentMessages, botMsg]);
        }
      } catch (error) {
        console.error("Error en sendMessage:", error);
        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text: "Error de conexión. Intenta de nuevo.",
        };
        setMessages([...currentMessages, botMsg]);
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