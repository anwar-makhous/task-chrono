export class Task {
    _id: string;
    _projectId: string;
    title: string;
    running: boolean;
    startDate: Date | undefined;
    lastRunDate: Date | undefined;
    totalSeconds: number | undefined; // Assuming this will store the duration in minutes

}