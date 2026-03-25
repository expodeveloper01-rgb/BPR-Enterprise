import React, { createContext, useContext, useEffect, useState } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [activeStore, setActiveStore] = useState(null);

  useEffect(() => {
    // Load active store from localStorage
    const stored = localStorage.getItem("activeStore");
    if (stored) setActiveStore(JSON.parse(stored));
  }, []);

  const selectStore = (store) => {
    setActiveStore(store);
    localStorage.setItem("activeStore", JSON.stringify(store));
  };

  const clearStore = () => {
    setActiveStore(null);
    localStorage.removeItem("activeStore");
  };

  return (
    <StoreContext.Provider value={{ activeStore, selectStore, clearStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};
