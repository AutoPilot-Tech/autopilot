import React, {createContext, useContext, useEffect, useState} from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({children}) => {
  // check for the users media query

  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [tracksLoading, setTracksLoading] = useState(true);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [googleEvents, setGoogleEvents] = useState([]);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 812px)");
    if (!mql.matches) {
      setOpenSideBar(true);
    }
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
        displayName,
        setDisplayName,
        photoUrl,
        setPhotoUrl,
        tracksLoading,
        setTracksLoading,
        openSideBar,
        setOpenSideBar,
        googleEvents,
        setGoogleEvents,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingValue = () => useContext(LoadingContext);
