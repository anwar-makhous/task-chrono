import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }


  getProjects() {
    return this.webReqService.get('projects');
  }

  createProject(title: string) {
    // We want to send a web request to create a project
    return this.webReqService.post('projects', { title });
  }

  updateProject(id: string, title: string) {
    // We want to send a web request to update a project
    return this.webReqService.patch(`projects/${id}`, { title });
  }

  updateTask(projectId: string, taskId: string, title: string) {
    // We want to send a web request to update a project
    return this.webReqService.patch(`projects/${projectId}/tasks/${taskId}`, { title });
  }

  deleteTask(projectId: string, taskId: string) {
    return this.webReqService.delete(`projects/${projectId}/tasks/${taskId}`);
  }

  deleteProject(id: string) {
    return this.webReqService.delete(`projects/${id}`);
  }

  getTasks(projectId: string) {
    return this.webReqService.get(`projects/${projectId}/tasks`);
  }

  createTask(title: string, projectId: string, startDate: Date) {
    // We want to send a web request to create a task
    return this.webReqService.post(`projects/${projectId}/tasks`, { title, startDate });
  }

  run(task: Task) {
    return this.webReqService.patch(`projects/${task._projectId}/tasks/${task._id}`, {
      running: !task.running,
      totalSeconds: task.totalSeconds,
      lastRunDate: task.lastRunDate
    });
  }
}
