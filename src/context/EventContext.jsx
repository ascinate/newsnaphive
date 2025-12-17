import React, { createContext, useState } from "react";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);     // old local events
  const [hives, setHives] = useState([]);       // backend hives

  return (
    <EventContext.Provider value={{ events, setEvents, hives, setHives }}>
      {children}
    </EventContext.Provider>
  );
};
