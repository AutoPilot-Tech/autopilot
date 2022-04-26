import React, {useState} from "react";
import {SpeakerphoneIcon, XIcon} from "@heroicons/react/outline";

export const Banner = ({setShowBanner}) => {
  return (
    <div className="bg-indigo-700">
      <div className="py-3 px-3 sm:px-6 lg:px-8 max-w-full">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-indigo-800">
              <SpeakerphoneIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span className="md:hidden">
                We're working on functionality! Hang in there!
              </span>
              <span className="hidden md:inline">
                Hang in there! We're working on core functionality.
              </span>
            </p>
          </div>

          <div className=" order-2 sm:order-3 sm:ml-3">
            <button
              type="button"
              className="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              onClick={() => setShowBanner(false)}
            >
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
