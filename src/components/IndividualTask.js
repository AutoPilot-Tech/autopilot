import React, {useState, useEffect, useRef, Fragment} from "react";
import {db} from "../firebase";
import {useTracksValue} from "../context/tracks-context";
import {Menu, Transition, Dialog} from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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

export function IndividualTask({task}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [showSettingsIcon, setShowSettingsIcon] = useState(false);
  const {tasks, setTasks} = useTracksValue();

  const navigation = [{name: "Delete Task", onClick: openModal}];

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const deleteTask = (docId) => {
    db.collection("tasks")
      .doc(docId)
      .delete()
      .then(() => {
        setTasks([...tasks]);
      });
  };

  const archiveTask = (id) => {
    db.collection("tasks").doc(id).update({
      archived: true,
    });
  };
  return (
    <>
      <div
        className="group flex"
        onMouseEnter={() => {
          setShowSettingsIcon(true);
        }}
        onMouseLeave={() => {
          if (!openSettings) {
            setShowSettingsIcon(false);
          }
        }}
      >
        <div className="w-16">
          <input
            type="checkbox"
            className="relative top-4 -mt-2 h-4 w-4 rounded border-gray-500 text-indigo-600 focus:ring-indigo-500 sm:left-6"
            value={task.task}
            onChange={(e) => archiveTask(task.id)}
          />
        </div>

        <div className=" py-4 pr-3 text-sm font-medium w-64 flex-auto ">
          {task.task}
        </div>
        <div className="w-14 flex-auto">
          <Menu
            as="div"
            className={
              showSettingsIcon
                ? "object-contain mr-4 mt-4 relative float-right"
                : "object-contain mr-4 mt-4 relative float-right hidden"
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
                                  active ? "bg-gray-100" : "",
                                  "block py-2 px-4 text-sm text-gray-700"
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
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="absolute inset-0 z-10 overflow-y-auto"
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
                <Dialog.Overlay className="absolute inset-0" />
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
                    Delete Task
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this task? This action
                      cannot be undone.
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
                        deleteTask(task.id);
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
      </div>
    </>
  );
}
