import React, { createContext, useContext, useState } from 'react';
import { useTracks } from '../hooks';

// allows us to pass data down the component, without props.

export const SelectedTrackContext = createContext();

export const SelectedTrackProvider = ({ children }) => {
  // the default 'track' is inbox.
  const [ selectedTrack, setSelectedTrack ] = useState('INBOX');

  return (
    <SelectedTrackContext.Provider value={{ selectedTrack, setSelectedTrack }}>
      {children}
    </SelectedTrackContext.Provider>
  );
};

export const useSelectedTrackValue = () => useContext(SelectedTrackContext);
