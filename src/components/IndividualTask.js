import React, {useState, useEffect, useRef, Fragment} from "react";
import {db} from "../firebase";
import {useTracksValue} from "../context/tracks-context";
import {Menu, Transition, Dialog} from "@headlessui/react";
import {useDrag, useDrop} from "react-dnd";
import {useTasks} from "../hooks/index";

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

export function IndividualTask({task, index, moveListItem}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [showSettingsIcon, setShowSettingsIcon] = useState(false);
  const {selectedTrack} = useTracksValue();
  const {tasks} = useTasks(selectedTrack);

  const ref = useRef(null);

  // This is how this task becomes draggable
  const [{isDragging}, dragRef, preview] = useDrag({
    type: "task",
    item: {index},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // This item task is also a drop area for other tasks
  const [{handlerId}, dropRef] = useDrop({
    accept: "task",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveListItem(dragIndex, hoverIndex, tasks);
      item.index = hoverIndex;
    },
  });

  // Join the 2 refs together into one (both draggable and can be dropped on)
  dragRef(dropRef(ref));

  // Make items being dragged transparent, so it's easier to see where we drop them

  const navigation = [{name: "Delete Task", onClick: openModal}];

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function reIndexTasks(startIndex) {
    db.collection("tasks")
      .where("trackId", "==", selectedTrack)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().index > startIndex) {
            doc.ref.update({
              index: doc.data().index - 1,
            });
          }
        });
      });
  }

  const deleteTask = (docId) => {
    db.collection("tasks")
      .doc(docId)
      .delete()
      .then(() => {
        // setTasks([...tasks]);
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
        className={
          isDragging
            ? "group flex text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded opacity-5"
            : "opacity-100 group flex text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded"
        }
        onMouseEnter={() => {
          setShowSettingsIcon(true);
        }}
        onMouseLeave={() => {
          if (!openSettings) {
            setShowSettingsIcon(false);
          }
        }}
        ref={preview}
        data-handler-id={handlerId}
      >
        <div className="w-8" ref={ref}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={
              showSettingsIcon
                ? "w-5 text-gray-400  ml-3 mt-4 relative float-left hover:text-gray-600 cursor-move"
                : "w-5  ml-3 mt-4 relative float-left text-gray-400 hover:text-gray-600 hidden"
            }
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <div className="w-16">
          <input
            type="checkbox"
            className="cursor-pointer relative top-4 -mt-2 h-4 w-4 rounded border-gray-500 text-indigo-600 focus:ring-indigo-500 sm:left-6"
            value={task.task}
            onChange={(e) => {
              archiveTask(task.id);
              reIndexTasks(task.index);
            }}
          />
        </div>

        <div className="py-4 pr-3 text-sm font-medium w-64 flex-auto ">
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
                      className="w-5 text-gray-400 hover:text-gray-600"
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
