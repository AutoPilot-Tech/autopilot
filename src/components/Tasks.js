import React from 'react';
import { Checkbox } from './Checkbox';

export const Tasks = () => {
  const tasks = [];

  let trackName = '';

  return (
      <div className="tasks" data-testid="tasks">
          <h2 data-testid="track-name">{trackName}</h2>

          <ul className="tasks__list">
                {tasks.map((task) => (
                    <li key={`${task.id}`}>
                        <Checkbox id={task.id} />
                        <span>{task.name}</span>
                    </li>
                ))}
          </ul>
      </div>
  )
}

