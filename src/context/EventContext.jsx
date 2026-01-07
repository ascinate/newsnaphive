import React, { createContext, useState } from "react";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);     // old local events
  const [hives, setHives] = useState([]);       // backend hives
  
  const fetchHives = async () => {
    const res = await api.get("/hives");
    setHives(res.data);
  };

  // ✅ NEW FUNCTION - Updates hive photos in real-time
  const updateHivePhotos = (hiveId, newPhotos) => {
    setHives(prevHives => 
      prevHives.map(hive => 
        hive._id === hiveId 
          ? { ...hive, images: newPhotos, photos: newPhotos }
          : hive
      )
    );
  };

  // ✅ NEW FUNCTION - Updates hive members count in real-time
  const updateHiveMembers = (hiveId, newMembers) => {
    setHives(prevHives => 
      prevHives.map(hive => 
        hive._id === hiveId 
          ? { ...hive, members: newMembers, memberCount: newMembers.length }
          : hive
      )
    );
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      setEvents, 
      hives, 
      setHives,
      fetchHives,
      updateHivePhotos,    // ✅ Export this
      updateHiveMembers    // ✅ Export this
    }}>
      {children}
    </EventContext.Provider>
  );
};