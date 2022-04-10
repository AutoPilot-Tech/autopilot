import React, { useState } from 'react';
import {
  FaChevronDown,
  FaInbox,
  FaCheckSquare,
  FaRegCalendar,
  FaConciergeBell,
  FaCommentDots,
} from 'react-icons/fa';
import { Tracks } from '../Tracks';
import { IndividualTrack } from '../IndividualTrack';
import { AddTrack } from '../AddTrack';
import { useTracksValue } from '../../context/tracks-context';
import { Routines } from '../Routines';
import { AddRoutine } from '../AddRoutine';
import { amplitude } from '../../utilities/amplitude';
import { auth } from '../../firebase';

export const Sidebar = () => {
  const { setSelectedTrack, isRoutine, setIsRoutine } = useTracksValue();
  const [showTracks, setShowTracks] = useState(true);
  const [showRoutines, setShowRoutines] = useState(true);
  const [active, setActive] = useState('next_7');

  const logClick = (event) => {
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent(event, userId);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <nav className="fixed space-y-1 float-left h-screen flex flex-col pl-3 w-64 shadow pt-20">
      <ul className="sidebar__generic">
        <li
          data-testid="next_7"
          className={classNames(
            active === 'next_7'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'flex items-center px-3 py-2 text-sm font-medium rounded-md'
          )}
          onClick={() => {
            setActive('next_7');
            setSelectedTrack('NEXT_7');
            logClick('sideBarCalendarClick');
            setIsRoutine(false);
          }}
        >
          <span className="mr-1">
            <FaRegCalendar />
          </span>
          <span>Daily Schedule</span>
        </li>
        <li
          data-testid="inbox"
          className={classNames(
            active === 'inbox'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'flex items-center px-3 py-2 text-sm font-medium rounded-md'
          )}
          onClick={() => {
            setActive('inbox');
            setSelectedTrack('INBOX');
            logClick('sideBarInboxClick');
            setIsRoutine(false);
          }}
        >
          <span className="mr-1">
            <FaInbox />
          </span>
          <span>Inbox</span>
        </li>
        <li
          data-testid="today"
          className={classNames(
            active === 'today'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'flex items-center px-3 py-2 text-sm font-medium rounded-md'
          )}
          onClick={() => {
            setActive('today');
            setSelectedTrack('TODAY');
            logClick('sideBarTodaysTasksClick');
            setIsRoutine(false);
          }}
        >
          <span className="mr-1">
            <FaCheckSquare />
          </span>
          <span>Today's Tasks</span>
        </li>
        {/* <li
          data-testid="assistant"
          className={active === 'assistant' ? 'active' : undefined}
          onClick={() => {
            setActive('assistant');
            setSelectedTrack('ASSISTANT');
          }}
        >
          <span>
            <FaCommentDots />
          </span>
          <span>Your Assistant</span>
        </li> */}
      </ul>
      <div
        className="sidebar__middle"
        onClick={() => {
          setShowTracks(!showTracks);
          logClick('sideBarShowTracksClick');
        }}
      >
        <div>
        <p className="pl-3 pt-3 float-left text-gray-400 font-medium">
          Tracks
        </p>
        <AddTrack />
        </div>

        
      </div>
      <ul className="sidebar__tracks">
        {<Tracks active={active} setActive={setActive} />}
      </ul>
      <div
        className="sidebar__middle"
        onClick={() => {
          setShowRoutines(!showRoutines);
          logClick('sideBarShowRoutinesClick');
        }}
      >
        <div>
        <p className="pl-3 pt-3 float-left text-gray-400 font-medium">
          Routines
        </p>
        <AddRoutine />
        </div>
        
      </div>
      <ul className="sidebar__tracks">
        {<Routines active={active} setActive={setActive} />}
      </ul>
    </nav>
  );
};
