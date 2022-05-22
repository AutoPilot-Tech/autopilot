import React, {createContext, useContext, useState} from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [tracksLoading, setTracksLoading] = useState(true);
  const [openSideBar, setOpenSideBar] = useState(false);
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
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingValue = () => useContext(LoadingContext);
