import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Task } from '../models/task.model';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() { }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600) || 0;
    const minutes = Math.floor((totalSeconds % 3600) / 60) || 0;
    const seconds = totalSeconds % 60 || 0;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedTime;
  }

  formatStartDate(startDate: Date): String {
    return new Date(startDate).toDateString() + " " + new Date(startDate).toLocaleTimeString();
  }

  generatePDF(project: Project, tasks: Task[]) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const content = [];

    content.push("Project title: " + project.title);
    content.push("\n\n");

    const header = ['Task title', 'Start Date', 'Time Spent'];
    const bodyData = tasks.map(task => [task.title, this.formatStartDate(task.startDate), this.formatTime(task.totalSeconds)]);

    const tableBody = [header];
    for (const row of bodyData) {
      tableBody.push(row.map(cell => cell.toString()));
    }

    const table = {
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto'],
        body: tableBody,
      },
    };



    content.push(table);

    // calculate total time spent on this project
    let sum = 0;
    tasks.forEach(task => {
      sum += task.totalSeconds;
    });

    content.push("\n\n");
    content.push("Total time spent on this project: " + this.formatTime(sum));

    const docDefinition = { content };

    // Create the PDF
    pdfMake.createPdf(docDefinition).open();
  }
}
