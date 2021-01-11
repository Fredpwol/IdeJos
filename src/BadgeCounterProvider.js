import React, {createContext, useState} from 'react';

export const BadgeContext = createContext();

export function BadgeProvider({children}) {
  const [topicCounter, settopicCounter] = useState(0);
  const [chatCounter, setchatCounter] = useState(0);
  const [requestCounter, setrequestCounter] = useState(0);
  return (
    <BadgeContext.Provider
      value={{
        topicCounter,
        settopicCounter,
        chatCounter,
        setchatCounter,
        requestCounter,
        setrequestCounter,
      }}>
      {children}
    </BadgeContext.Provider>
  );
}
