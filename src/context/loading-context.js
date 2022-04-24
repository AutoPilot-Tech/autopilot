import React, {createContext, useContext, useState} from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [tracksLoading, setTracksLoading] = useState(true);
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
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingValue = () => useContext(LoadingContext);
