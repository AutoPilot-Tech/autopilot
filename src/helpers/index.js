import { collatedTasks } from '../constants';

export const getTitle = (tracks, selectedTrackId) => {
    console.log('tracks',tracks)
    console.log('selectedTrack',selectedTrackId)
    let track = tracks.find(track => track.trackId === selectedTrackId)
    return track.name
}

export const getCollatedTitle = (tracks, key) => {
    let track = tracks.find(track => track.key === key);
    console.log(track)
    return track.name
}

export const collatedTasksExist = selectedTrack => {
    console.log(collatedTasks)
    return collatedTasks.find(task => task.key === selectedTrack);
}

// this is just taken from online, its similar to how firebase does it
export const generatePushId = (() => {
    const PUSH_CHARS =
      '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
  
    const lastRandChars = [];
  
    return function() {
      let now = new Date().getTime();
  
      const timeStampChars = new Array(8);
      for (var i = 7; i >= 0; i--) {
        timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
        now = Math.floor(now / 64);
      }
  
      let id = timeStampChars.join('');
  
      for (i = 0; i < 12; i++) {
        id += PUSH_CHARS.charAt(lastRandChars[i]);
      }
  
      return id;
    };
  })();