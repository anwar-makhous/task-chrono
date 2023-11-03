import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { Project } from 'src/app/models/project.model';
import { AuthService } from 'src/app/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  projects: Project[];
  tasks: Task[];

  selectedProjectId: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  private timerSubscription: Subscription;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.projectId) {
          this.selectedProjectId = params.projectId;
          this.taskService.getTasks(params.projectId).subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          })
        } else {
          this.tasks = undefined;
        }
      }
    )

    this.taskService.getProjects().subscribe((projects: Project[]) => {
      this.projects = projects;
    })

    // Subscribe to a timer that updates the time every second
    this.timerSubscription = interval(1000).subscribe(() => {
      // Update the time display for each task
      this.tasks.forEach(task => {
        if (task.running) {
          task.totalMinutes = (task.totalMinutes || 0) + 1;
        }
      });
    });

  }

  onTaskClick(task: Task) {
    // we want to set the task to running
    this.taskService.run(task).subscribe(() => {
      // the task has been set to running successfully
      console.log("Task is running!");
      task.running = !task.running;
    })
  }

  onDeleteProjectClick() {
    this.taskService.deleteProject(this.selectedProjectId).subscribe((res: any) => {
      this.router.navigate(['/projects']);
      console.log(res);
    })
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedProjectId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log(res);
    })
  }

  onLogoutClick() {
    this.authService.logout()
  }

  // Function to start or stop the timer when the "Start/Stop" button is clicked
  onStartStopClick(task: Task): void {
    // Ensure that the click event only works on the "Start/Stop" button
    if (task.running) {
      // Stop the timer
      task.stopTime = new Date();
      task.running = false;
      // Calculate the total duration in minutes (assuming startTime and stopTime are defined)
      task.totalMinutes = (task.stopTime.getTime() - task.startTime.getTime()) / 60000;
      // You can save this task data to your backend or update it as needed
    } else {
      // Start the timer
      task.startTime = new Date();
      task.running = true;
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the timer when the component is destroyed
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // Function to format the time display as "00:00:00" with rounded seconds
  formatTime(totalMinutes: number | undefined): string {
    if (totalMinutes !== undefined) {
      const hours = Math.floor(totalMinutes / 60 / 60);
      const minutes = Math.floor((totalMinutes / 60) % 60);
      const seconds = Math.round(totalMinutes % 60); // Round to the nearest integer
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return '00:00:00';
  }
}