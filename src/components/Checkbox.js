import React from 'react';
import { db } from '../firebase';

export const Checkbox = ({ id }) => {
  const archiveTask = () => {
    db.collection('tasks').doc(id).update({
      archived: true,
    });
  };

  return (
    <div
      className="checkbox-holder"
      data-testid="checkbox-action"
      onClick={() => archiveTask()}
    >
      <span className="checkbox" />
    </div>
  );
};
