import React, { useState, Fragment } from 'react';
import { FaTrash, FaTrashAlt } from 'react-icons/fa';
import { useTracksValue } from '../context/tracks-context';
import { db } from '../firebase';
import { Menu, Popover, Transition, Dialog } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/solid';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { Modal } from './Modal';

const user = {
  name: 'Chelsea Hagon',
  email: 'chelsea.hagon@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

// function DeletionDialog() {
//   let [isOpen, setIsOpen] = useState(true);

//   return (
//     <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
//       <Dialog.Overlay />

//       <Dialog.Title>Delete track</Dialog.Title>
//       <Dialog.Description>
//         This will permanently delete this track
//       </Dialog.Description>

//       <p>
//         Are you sure you want to delete this track? This action cannot be undone.
//       </p>

//       <button onClick={() => setIsOpen(false)}>Cancel</button>
//       <button onClick={() => setIsOpen(false)}>Delete</button>
//     </Dialog>
//   )
// }

export const IndividualTrack = ({ track }) => {
  let [isOpen, setIsOpen] = useState(false)
  const { tracks, setTracks, setSelectedTrack } = useTracksValue();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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
      {/* <span
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
      </span> */}
      <div className="group">
        <button className="ml-44 "type="button" onClick={openModal}>
          <FaTrashAlt className="fill-slate-400 hidden group-hover:block "/>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Delete track
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this track? This action cannot be undone.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => {
                      deleteTrack(track.docId);
                      closeModal();
                    }
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
