export class Task {
    _id: string;
    _projectId: string;
    title: string;
    running: boolean;
    startTime: Date | undefined; // Use Date type for timestamps
    stopTime: Date | undefined;
    totalMinutes: number | undefined; // Assuming this will store the duration in minutes

}