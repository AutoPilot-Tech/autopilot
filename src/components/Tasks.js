import React from 'react';
import { collection, getDocs } from "firebase/firestore";
import { Checkbox } from './Checkbox';
import { useTasks } from '../hooks';


// this just gets the tasks and renders them
export const Tasks = () => {
  const { tasks, archivedTasks } = useTasks("1")

  let trackName = '';


  return (
      <div className="tasks" data-testid="tasks">
          <h2 data-testid="track-name">{trackName}</h2>

          <ul className="tasks__list">
                {tasks.map((task) => (
                    <li key={`${task.id}`}>
                        <Checkbox id={task.id} />
                        <span>{task.task}</span>
                    </li>
                ))}
          </ul>
      </div>
  )
}

