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
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  

  return (
    <nav className="fixed space-y-1 float-left h-screen flex flex-col pl-3 w-64 shadow">
      <ul className="sidebar__generic">
        <li
          data-testid="next_7"
          className={classNames(active === 'next_7' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          'flex items-center px-3 py-2 text-sm font-medium rounded-md')}
          onClick={() => {
            setActive('next_7');
            setSelectedTrack('NEXT_7');
            logClick('sideBarCalendarClick');
            setIsRoutine(false);
          }}
        >
          <span>
            <FaRegCalendar />
          </span>
          <span>Daily Schedule</span>
        </li>
        <li
          data-testid="inbox"
          className={classNames(active === 'inbox' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          'flex items-center px-3 py-2 text-sm font-medium rounded-md')}
          onClick={() => {
            setActive('inbox');
            setSelectedTrack('INBOX');
            logClick('sideBarInboxClick');
            setIsRoutine(false);
          }}
        >
          <span>
            <FaInbox />
          </span>
          <span>Inbox</span>
        </li>
        <li
          data-testid="today"
          className={classNames(active === 'today' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          'flex items-center px-3 py-2 text-sm font-medium rounded-md')}
          onClick={() => {
            setActive('today');
            setSelectedTrack('TODAY');
            logClick('sideBarTodaysTasksClick');
            setIsRoutine(false);
          }}
        >
          <span>
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
        <span>
          <FaChevronDown
            className={!showTracks ? 'hidden-projects' : undefined}
          />
        </span>
        <h2>Tracks</h2>
      </div>
      <ul className="sidebar__tracks">{showTracks && <Tracks active={active} setActive={setActive}/>}</ul>
      <AddTrack />
      <div
        className="sidebar__middle"
        onClick={() => {
          setShowRoutines(!showRoutines);
          logClick('sideBarShowRoutinesClick');
        }}
      >
        <span>
          <FaChevronDown
            className={!showRoutines ? 'hidden-projects' : undefined}
          />
        </span>
        <h2>Routines</h2>

        </div>
        <ul className="sidebar__tracks">{showRoutines && <Routines active={active} setActive={setActive}/>}</ul>
        <AddRoutine />
      
    </nav>
  );
};
