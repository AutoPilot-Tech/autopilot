import {CreateAction} from "./CreateAction";
import {useLoadingValue} from "../context/loading-context";

export function TaskHeader({trackName, trackId}) {
  const {userData} = useLoadingValue();
  return (
    <div className="flex flex-row pb-5 pt-5 mb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between sm:ml-10">
      <h3 className="text-lg leading-6 text-gray-900 font-bold sm:ml-10">
        {userData["trackIdsMapToTrackNames"][trackId] || trackName}
      </h3>
      {/* This is currently hidden until further notice */}
      <div className="mt-3 hidden">
        <CreateAction trackId={trackId} />
      </div>
    </div>
  );
}
