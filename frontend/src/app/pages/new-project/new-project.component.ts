import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project.model';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit() {
  }

  createProject(title: string) {
    this.taskService.createProject(title).subscribe((project: Project) => {
      // Now we navigate to /projects/task._id
      this.router.navigate(['/projects', project._id]);
    });
  }

}
