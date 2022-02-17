import React from 'react';
import { db } from '../firebase';

export const Checkbox = ({ id }) => {
  const archiveTask = () => {
    console.log('Firebase collection update, from Checkbox.js');
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
