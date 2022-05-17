
import {CreateAction} from "./CreateAction";

export function TaskHeader({trackName, trackId}) {
  return (
    <div className="pb-5 pt-5 mb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-lg leading-6 text-gray-900 font-bold">{trackName}</h3>
      <div className="mt-3 sm:mt-0 sm:ml-4">
        <CreateAction trackId={trackId}/>
      </div>
    </div>
  );
}
