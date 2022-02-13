import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { useTracksValue } from '../context/tracks-context';
import { useSelectedTrackValue } from '../context/selected-track-context';
import { db } from '../firebase';

export const IndividualTrack = ({ track }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { tracks, setTracks } = useTracksValue();
  const { setSelectedTrack } = useSelectedTrackValue();

  const deleteTrack = (docId) => {
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
                    <p>Are you sure you want to delete this track? This cannot be undone.</p>
                    <button
                        type="button"
                        onClick={() => {
                            deleteTrack(track.docId);
                        }}
                        >
                            Delete
                            <span onClick={() => setShowConfirm(!showConfirm)}>Cancel</span>
                        </button>
            </div>
        </div>
        )}
        
      </span>
    </>
  );
};
