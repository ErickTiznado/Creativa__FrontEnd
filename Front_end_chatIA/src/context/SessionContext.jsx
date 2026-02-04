import sessionContext from "./SessionContextValue";
import { useState } from "react";

const SessionProvider = ({ children }) => {
  const [activeDraft, setActiveDraft] = useState(null);
  
    return (
    <sessionContext.Provider value={{activeDraft, setActiveDraft}}>
      {children}
    </sessionContext.Provider>
  );
};

export default SessionProvider;


