import { collatedTasks } from '../constants';

export const getTitle = (tracks, trackId) => {
    tracks.find(track => track.trackId === trackId);
}

export const getCollatedTitle = (tracks, key) => {
    tracks.find(track => track.key === key);
}

export const collatedTasksExist = selectedTrack => {
    collatedTasks.find(task => task.key === selectedTrack);
}
