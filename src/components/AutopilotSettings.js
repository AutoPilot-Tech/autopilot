import React, {useState} from "react";
import {useTracksValue} from "../context/tracks-context";
import {
  CalendarIcon,
  LocationMarkerIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import {RadioButton} from "./RadioButton";
import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";

const notificationMethods = [
  {id: "low", title: "Low"},
  {id: "medium", title: "Medium"},
  {id: "high", title: "High"},
];

export function AutopilotSettings() {
  const {tracks} = useTracksValue();
  const [wakeValue, setWakeValue] = useState("");
  const [quitValue, setQuitValue] = useState("");
  // filter out any routines
  const filteredTracks = tracks.filter((track) => !track.routine);
  const nonStarter = filteredTracks.filter((track) => {
    return track.name != "Start here!";
  });
  return (
    <div className="pt-20 ml-80 h-screen space-y-6 flex-1 mr-40">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Priority Settings
        </h3>
        <p className="text-sm leading-5 text-gray-500">
          This determines how the project is prioritized.
        </p>
        <ul role="list" className="divide-y divide-gray-200">
          {nonStarter.map((track) => (
            <li key={track.id}>
              <a href="#" className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-indigo-600 truncate">
                      {track.name}
                    </p>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div>
                        <label className="text-sm font-small text-gray-900">
                          Priority
                        </label>

                        <fieldset className="mt-2">
                          <legend className="sr-only">Priority level</legend>
                          <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                            {notificationMethods.map((notificationMethod) => (
                              <div
                                key={notificationMethod.id}
                                className="flex items-center"
                              >
                                <input
                                  id={notificationMethod.id}
                                  name="notification-method"
                                  type="radio"
                                  defaultChecked={
                                    notificationMethod.id === "medium"
                                  }
                                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                />
                                <label
                                  htmlFor={notificationMethod.id}
                                  className="ml-3 block text-sm font-medium text-gray-700"
                                >
                                  {notificationMethod.title}
                                </label>
                              </div>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <RadioButton />
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Wake and Quit Times
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Decide when Autopilot will begin scheduling tasks, and when it
              stops.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form className="space-y-6" action="#" method="POST">
              <fieldset>
                <legend className="text-base font-medium text-gray-900">
                  Wake Up{" "}
                </legend>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Wake Time"
                  value={wakeValue}
                  onChange={(newValue) => {
                    setWakeValue(newValue);
                  }}
                />
              </fieldset>
              <fieldset>
                <div>
                  <legend className="text-base font-medium text-gray-900">
                    Quitting Time
                  </legend>
                  <p className="text-sm text-gray-500">
                    This can be when you sleep, or when you wish to relax.
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Quit Time"
                    value={quitValue}
                    onChange={(newValue) => {
                      setQuitValue(newValue);
                    }}
                  />
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}
