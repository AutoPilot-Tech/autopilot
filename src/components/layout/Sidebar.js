import React, { useState } from 'react';
import {
  FaChevronDown,
  FaInbox,
  FaRegCalendarAlt,
  FaRegCalendar,
} from 'react-icons/fa';
import { Tracks } from '../Tracks';
import { useSelectedTrackValue } from '../../context';
import { IndividualTrack } from '../IndividualTrack';
import { AddTrack } from '../AddTrack';

export const Sidebar = () => {
  const { setSelectedTrack } = useSelectedTrackValue();
  const [active, setActive] = useState('inbox');
  const [showTracks, setShowTracks] = useState(true);

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
          <span>Today's Schedule</span>
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
          <span>Next 7 Days</span>
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
    </div>
  );
};
