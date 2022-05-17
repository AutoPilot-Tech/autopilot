import {Fragment, useState} from "react";
import {PlusSmIcon as PlusSmIconSolid} from "@heroicons/react/solid";
import {PlusSmIcon as PlusSmIconOutline} from "@heroicons/react/outline";
import {Dialog, Menu, Popover, Transition} from "@headlessui/react";
import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const CircularButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [task, setTask] = useState("");

  function addTask() {
    return;
  }
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const navigation = [
    {
      name: "Add Task",
      onClick: () => {
        // open modal
        openModal();
        console.log(isOpen);
      },
    },
    {
      name: "Add Routine",
      open: "Routine",
    },
  ];

  return (
    <>
      {/* <button
        type="button"
        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusSmIconSolid className="h-5 w-5" aria-hidden="true" />
      </button> */}
      <Menu as="div" className="flex-shrink-0 relative mr-5">
        <div>
          <Menu.Button className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Open user menu</span>
            <div className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PlusSmIconSolid className="h-5 w-5" aria-hidden="true" />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
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
      </Menu>
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
                  Add New Task
                </Dialog.Title>

                <div className="mt-4 mb-4 grid grid-cols-2 gap-4">
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Start Date"
                    value={startValue}
                    onChange={(newValue) => {
                      setStartValue(newValue);
                      setTaskStartDate(newValue.format());
                    }}
                  />

                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="End Date"
                    value={endValue}
                    onChange={(newValue) => {
                      setEndValue(newValue);
                      setTaskEndDate(newValue.format());
                    }}
                    onClick={() => {
                      logClick("taskEndDateClick");
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 mt-2 text-gray-900">Task Name</label>
                  <input
                    className="add-task__content"
                    data-testid="add-task-content"
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                  />
                </div>

                {/* <span
                    className="add-task__project"
                    data-testid="show-track-overlay"
                    onClick={() => {
                      setShowTrackOverlay(!showTrackOverlay);
                    }}
                  >
                    <FaRegListAlt />
                  </span> */}
                {/* <span
                    className="add-task__date"
                    data-testid="show-task-date-overlay"
                    onClick={() => {
                      setShowTaskDate(!showTaskDate);
                    }}
                  >
                    <FaRegCalendarAlt />
                  </span> */}

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
                    className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={addTask}
                  >
                    Add Task
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
