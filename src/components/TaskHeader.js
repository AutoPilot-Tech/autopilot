import {CreateAction} from "./CreateAction";

export function TaskHeader({trackName, trackId}) {
  return (
    <div className="flex flex-row pb-5 pt-5 mb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-lg leading-6 text-gray-900 font-bold sm:ml-10">
        {trackName}
      </h3>
      {/* This is currently hidden until further notice */}
      <div className="mt-3 hidden">
        <CreateAction trackId={trackId} />
      </div>
    </div>
  );
}
