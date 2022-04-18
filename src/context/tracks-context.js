import React, { createContext, useContext, useState } from 'react';
import { useTracks } from '../hooks';
import { useEvents } from '../hooks';
import { useActive } from '../hooks';

// allows us to pass data down the component, without props.

export const TracksContext = createContext();
// provider is at the top level, and a consumer is at the
// bottom level wherever maybe 6 levels deep
export const TracksProvider = ({ children }) => {
  const { tracks, setTracks } = useTracks();
  const [selectedTrack, setSelectedTrack] = useState('CALENDAR');
  const { events, setEvents } = useEvents();
  const [isRoutine, setIsRoutine] = useState(false);
  const [active, setActive] = useState('calendar');
  const [selectedRoutine, setSelectedRoutine] = useState('');
  // 1. Whenever u need to do something, just rmember to make a custom hook,
  // 2. import it, and then destructure it in the tracks provider
  // 3. create a state in the provider, and then use it in the consumer


  return (
    <TracksContext.Provider
      value={{ tracks, setTracks, selectedTrack, setSelectedTrack, events, setEvents, isRoutine, setIsRoutine, active, setActive, selectedRoutine, setSelectedRoutine }}
    >
      {children}
    </TracksContext.Provider>
  );
};

// this will return the tracks
export const useTracksValue = () => useContext(TracksContext);

// example
// const { tracks } = useProjectsValue();
