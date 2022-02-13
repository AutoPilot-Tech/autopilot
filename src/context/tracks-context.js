import React, { createContext, useContext } from 'react';
import { useTracks } from '../hooks';

// allows us to pass data down the component, without props.

export const TracksContext = createContext();
// provider is at the top level, and a consumer is at the
// bottom level wherever maybe 6 levels deep
export const TracksProvider = ({ children }) => {
    const { tracks, setTracks } = useTracks();
    console.log('from inside tracks-context.js:', tracks);

    return (
        <TracksContext.Provider value={{ tracks, setTracks }}>
            {children}
        </TracksContext.Provider>
    );
};

// this will return the tracks
export const useTracksValue = () => useContext(TracksContext);



// example
// const { tracks } = useProjectsValue();