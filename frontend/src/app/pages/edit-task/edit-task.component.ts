import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  taskId: string;
  projectId: string;


  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskId = params.taskId;
        this.projectId = params.projectId;
      }
    )
  }

  updateTask(title: string) {
    this.taskService.updateTask(this.projectId, this.taskId, title).subscribe(() => {
      this.router.navigate(['/projects', this.projectId]);
    })
  }

}
