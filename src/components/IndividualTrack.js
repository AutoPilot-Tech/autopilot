import React, {useState, Fragment, useRef, useEffect} from "react";
import {FaTrash, FaTrashAlt} from "react-icons/fa";
import {useTracksValue} from "../context/tracks-context";
import {db} from "../firebase";
import {Menu, Popover, Transition, Dialog} from "@headlessui/react";
import {SearchIcon} from "@heroicons/react/solid";
import {BellIcon, MenuIcon, XIcon} from "@heroicons/react/outline";
import {Modal} from "./Modal";
import {FormControlUnstyledContext} from "@mui/material/node_modules/@mui/base";

const user = {
  name: "Chelsea Hagon",
  email: "chelsea.hagon@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, setOpenSettings, setShowSettingsIcon) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenSettings(false);
        setShowSettingsIcon(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(
    wrapperRef,
    props.setOpenSettings,
    props.setShowSettingsIcon
  );

  return <div ref={wrapperRef}>{props.children}</div>;
}

export const IndividualTrack = ({track}) => {
  let [isOpen, setIsOpen] = useState(false);
  const {tracks, setTracks, setSelectedTrack} = useTracksValue();
  const [openSettings, setOpenSettings] = useState(false);
  const [showSettingsIcon, setShowSettingsIcon] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const deleteTrack = (docId) => {
    db.collection("tracks")
      .doc(docId)
      .delete()
      .then(() => {
        setTracks([...tracks]);
        setSelectedTrack("INBOX");
      });
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const navigation = [{name: "Delete Project", onClick: openModal}];

  return (
    <>
      <div
        className="grid grid-cols-2 group w-full"
        onMouseEnter={() => {
          setShowSettingsIcon(true);
        }}
        onMouseLeave={() => {
          if (!openSettings) {
            setShowSettingsIcon(false);
          }
        }}
      >
        <div className="">
          <span className="">{track.name}</span>
        </div>
        <div>
          <Menu
            as="div"
            className={
              showSettingsIcon
                ? "object-contain mr-1 relative float-right h-2"
                : "object-contain mr-1 relative float-right hidden h-2"
            }
          >
            {({open}) => (
              <>
                <Menu.Button>
                  <span className="sr-only">Open user menu</span>
                  <div className="object-contain">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      onClick={() => {
                        setOpenSettings(true);
                        setShowSettingsIcon(true);
                      }}
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </div>
                </Menu.Button>
                {openSettings && (
                  <OutsideAlerter
                    setOpenSettings={setOpenSettings}
                    setShowSettingsIcon={setShowSettingsIcon}
                  >
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none"
                      >
                        {navigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({active}) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100 cursor-pointer" : "",
                                  "block py-2 px-4 text-sm text-gray-700 cursor-pointer"
                                )}
                                onClick={item.onClick ? item.onClick : null}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </OutsideAlerter>
                )}
              </>
            )}
          </Menu>
        </div>
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
                    Are you sure you want to delete this track? This action
                    cannot be undone.
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2">
                  <button
                    type="button"
                    className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={() => {
                      deleteTrack(track.docId);
                      closeModal();
                    }}
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
