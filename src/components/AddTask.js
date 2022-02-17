import React, { useState } from 'react';
import { FaRegListAlt, FaRegCalendarAlt } from 'react-icons/fa';
import moment from 'moment';
import { db } from '../firebase';
import { useTracksValue } from '../context/tracks-context';

export const AddTask = ({
  showAddTaskMain = true,
  showShouldMain = false,
  showQuickAddTask,
  setShowQuickAddTask,
}) => {
  const [task, setTask] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [track, setTrack] = useState('');
  const [showMain, setShowMain] = useState(shouldShowMain);
  const [showTrackOverlay, setShowTrackOverlay] = useState(false);
  const [showTaskDate, setShowTaskDate] = useState(false);

  const { selectedTrack } = useTracksValue();

  const addTask = () => {
    const trackId = track || selectedTrack;
    let collatedDate = '';

    if (trackId === 'TODAY') {
      collatedDate = moment().format('DD/MM/YYYY');
    } else if (trackId === 'NEXT_7') {
      collatedDate = moment().add(7, 'days').format('DD/MM/YYYY');
    }
    return (task && trackId && db
        .collection('tasks')
        .add({
            archived: false,
            trackId,
            task,
            date: collatedDate || taskDate,
            userId: '1337',
        })
        .then(() => {
            setTask('')
            setTrack('')
            setShowMain('');
            setShowTrackOverlay(false);
        })
    )};
  return (
      <div
      className={showQuickAddTask ? 'add-task add-task__overlay' : 'add-task'}
  )
};
