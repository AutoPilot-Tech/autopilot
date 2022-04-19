import {useEffect, useState} from "react";
import moment from "moment";
import {db, auth} from "../firebase";

export function CurrentTasks() {
  const [currentTasks, setCurrentTasks] = useState([]);
  const [trackName, setTrackName] = useState("");
  // generate a key
  const generateKey = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const tasks = [
    {
      task: "Work",
      dueDate: "Tomorrow",
      project: "Project 1",
      key: generateKey(),
    },
    {
      task: "Work",
      dueDate: "Tomorrow",
      project: "Project 1",
      key: generateKey(),
    },
    {
      task: "Work",
      dueDate: "Tomorrow",
      project: "Project 1",
      key: generateKey(),
    },
    {
      task: "Work",
      dueDate: "Tomorrow",
      project: "Project 1",
      key: generateKey(),
    },
  ];

  // Get the current routine
  useEffect(() => {
    // get the time in hh:mm format
    let currentTime = moment().format("hh:mm A");

    // Now get the user's scheduleArray and see which event our time is in
    let unsubscribe = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("events")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let event = doc.data();
          console.log(`Now visiting ${event.title}`);

          let startTime = event.startTime;
          let endTime = event.endTime;
          let startTimeMoment = moment(startTime, "hh:mm A");
          let endTimeMoment = moment(endTime, "hh:mm A");
          let currentTimeMoment = moment(currentTime, "hh:mm A");
          if (currentTimeMoment.isBetween(startTimeMoment, endTimeMoment)) {
            // set the current tasks
            console.log(
              `${event.title} is between ${startTime} and ${endTime}`
            );
            setTrackName(event.title);

            // get the tasks that belong to this track
            db.collection("tasks")
              .where("trackId", "==", event.trackId)
              .get()
              .then((snapshot) => {
                let tasks = [];
                snapshot.forEach((doc) => {
                  let task = doc.data();
                  tasks.push(task);
                });
                setCurrentTasks(tasks);
              });
          }
        });
      });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-hidden h-96">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">{trackName}</h1>
          {/* <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p> */}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Task
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-hidden sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Task
                    </th>
                    {/* <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Due Date
                    </th> */}
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Routine
                    </th>

                    {/* <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentTasks.map((task) => (
                    <tr key={generateKey}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {task.task}
                      </td>
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {task.dueDate}
                      </td> */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {task.project}
                      </td>

                      {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {task.task}</span>
                        </a>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
