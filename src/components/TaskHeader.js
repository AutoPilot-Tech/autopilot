import {PlusIcon} from "@heroicons/react/solid";
import {useTracks} from "../context/tracks-context";
import {ColorSettings} from "./ColorSettings";
import {AddTaskNew} from "./AddTaskNew";

export function TaskHeader({trackName}) {
  return (
    <div className="pb-5 pt-5 mb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-lg leading-6 text-gray-900 font-bold">{trackName}</h3>
      <div className="mt-3 sm:mt-0 sm:ml-4">
        <AddTaskNew />
      </div>
    </div>
  );
}
