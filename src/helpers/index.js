import { collatedTasks } from '../constants';

export const collatedTasksExist = selectedTrack => {
    collatedTasks.find(task => task.key === selectedTrack);


}
