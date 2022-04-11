import { PlusIcon } from '@heroicons/react/solid'


export function TaskHeader({trackName}) {
    return (
      <div className="pb-5 pt-5 mb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-lg leading-6 text-gray-900 font-bold">{trackName}</h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Task
        </button>
        </div>
      </div>
    )
  }