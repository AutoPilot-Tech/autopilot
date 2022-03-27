import React, { useState } from 'react';
import { useTracksValue } from '../context/tracks-context';
import { IndividualTrack } from './IndividualTrack';

export const Routines = ({ activeValue = null}) => {
    const [active, setActive] = useState(activeValue);
    return (
        <></>
    )
}