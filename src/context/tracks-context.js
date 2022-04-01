import React, { createContext, useContext, useState } from 'react';
import { useTracks } from '../hooks';
// import { useEvents } from '../hooks';

// allows us to pass data down the component, without props.

export const TracksContext = createContext();
// provider is at the top level, and a consumer is at the
// bottom level wherever maybe 6 levels deep
export const TracksProvider = ({ children }) => {
  const { tracks, setTracks } = useTracks();
  const [selectedTrack, setSelectedTrack] = useState('INBOX');
  // add events here from useEvents custom hook:
  // const [events, setEvents] = useEvents();

  return (
    <TracksContext.Provider
      value={{ tracks, setTracks, selectedTrack, setSelectedTrack }}
    >
      {children}
    </TracksContext.Provider>
  );
};

// this will return the tracks
export const useTracksValue = () => useContext(TracksContext);

// example
// const { tracks } = useProjectsValue();
