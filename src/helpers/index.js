import { collatedTasks } from '../constants';

export const getTitle = (tracks, trackId) => {
    tracks.find(track => track.trackId === trackId);
}



export const collatedTasksExist = selectedTrack => {
    collatedTasks.find(task => task.key === selectedTrack);
}
