import React, { useState } from 'react';
import {
  FaChevronDown,
  FaInbox,
  FaRegCalendarAlt,
  FaRegCalendar,
} from 'react-icons/fa';
import { Tracks } from '../Tracks';
import { IndividualTrack } from '../IndividualTrack';
import { AddTrack } from '../AddTrack';
import { useTracksValue } from '../../context/tracks-context';

export const Sidebar = () => {
  const { setSelectedTrack } = useTracksValue();
  const [active, setActive] = useState('inbox');
  const [showTracks, setShowTracks] = useState(true);
  const [showRoutines, setShowRoutines] = useState(false);

  return (
    <div className="sidebar" data-testid="sidebar">
      <ul className="sidebar__generic">
        <li
          data-testid="inbox"
          className={active === 'inbox' ? 'active' : undefined}
          onClick={() => {
            setActive('inbox');
            setSelectedTrack('INBOX');
          }}
        >
          <span>
            <FaInbox />
          </span>
          <span>Inbox</span>
        </li>
        <li
          data-testid="today"
          className={active === 'today' ? 'active' : undefined}
          onClick={() => {
            setActive('today');
            setSelectedTrack('TODAY');
          }}
        >
          <span>
            <FaRegCalendar />
          </span>
          <span>Today's Tasks</span>
        </li>
        <li
          data-testid="next_7"
          className={active === 'next_7' ? 'active' : undefined}
          onClick={() => {
            setActive('next_7');
            setSelectedTrack('NEXT_7');
          }}
        >
          <span>
            <FaRegCalendarAlt />
          </span>
          <span>Today's Schedule</span>
        </li>
      </ul>
      <div
        className="sidebar__middle"
        onClick={() => {
          setShowTracks(!showTracks);
        }}
      >
        <span>
          <FaChevronDown className={!showTracks ? 'hidden-projects' : undefined }/>
        </span>
        <h2>Tracks</h2>
      </div>
      <ul className="sidebar__tracks">{showTracks && <Tracks />}</ul>
      <AddTrack />
      <div
        className="sidebar__middle"
        onClick={() => {
          setShowRoutines(!showRoutines);
        }}
        >
          <span>
            <FaChevronDown className={!showRoutines ? 'hidden-projects' : undefined }/>
          </span>
          <h2>Routines</h2>

        </div>
    </div>
  );
};
