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
            // add difference in seconds for running tasks
            this.tasks.forEach(task => {
              if (task.running) {
                task.totalSeconds += this.calculateTimeDifferenceInSeconds(new Date(task.lastRunDate));
              }
            });
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
          task.totalSeconds = (task.totalSeconds || 0) + 1;
        }
      });
    });

  }

  onTaskClick(task: Task): void {
    if (task.running) {
      task.lastRunDate = new Date();
    }
    // we want to set the task to running
    this.taskService.run(task).subscribe(() => {
      // the task has been set to running successfully
      task.running = !task.running;
    })
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600) || 0;
    const minutes = Math.floor((totalSeconds % 3600) / 60) || 0;
    const seconds = totalSeconds % 60 || 0;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedTime;
  }

  calculateTimeDifferenceInSeconds(targetDate: Date): number {
    const currentDate = new Date();
    const differenceInSeconds = Math.floor((currentDate.getTime() - targetDate.getTime()) / 1000);
    return differenceInSeconds;
  }

  onDeleteProjectClick() {
    this.taskService.deleteProject(this.selectedProjectId).subscribe((res: any) => {
      this.router.navigate(['/projects']);
    })
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedProjectId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
    })
  }

  onLogoutClick() {
    this.authService.logout()
  }

  ngOnDestroy() {
    // Unsubscribe from the timer when the component is destroyed
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}