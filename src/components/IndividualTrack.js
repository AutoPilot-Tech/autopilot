import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useTracksValue } from '../context/tracks-context';
import { db } from '../firebase';

export const IndividualTrack = ({ track }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { tracks, setTracks, setSelectedTrack } = useTracksValue();

  const deleteTrack = (docId) => {
    console.log('Firebase doc delete, from IndividualTrack.js');
    db.collection('tracks')
      .doc(docId)
      .delete()
      .then(() => {
        setTracks([...tracks]);
        setSelectedTrack('INBOX');
      });
  };

  return (
    <>
      <span className="sidebar__dot">•</span>
      <span className="sidebar__track-name">{track.name}</span>
      <span
        className="sidebar__track-delete"
        onKeyDown={() => setShowConfirm(!showConfirm)}
        onClick={() => setShowConfirm(!showConfirm)}
      >
        <FaTrashAlt />
        {showConfirm && (
          <div className="track-delete-modal">
            <div className="track-delete-modal__inner">
              <p>
                Are you sure you want to delete this track? This cannot be
                undone.
              </p>
              <button
                type="button"
                onClick={() => {
                  deleteTrack(track.docId);
                }}
              >
                Delete
              </button>
              <span onClick={() => setShowConfirm(!showConfirm)}>Cancel</span>
            </div>
          </div>
        )}
      </span>
    </>
  );
};
