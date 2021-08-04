import { ITask } from './task.interface';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import * as uuid from 'uuid';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    description: new FormControl(''),
    status: new FormControl(),// true = Finished false = Active
  });

  tasks: ITask[] = [];
  task: ITask;
  isEditForm = false;
  isAscending = true;

  constructor() { }

  ngOnInit(): void { }

  toggleTask(task: ITask) {
    if (task.status) {
      this.tasks.unshift(this.tasks.splice(this.tasks.indexOf(task), 1)[0]);
    } else {
      this.tasks.push(this.tasks.splice(this.tasks.indexOf(task), 1)[0]);
    }
    task.status = !task.status;
  }

  addTask() {
    let task = {
      id: uuid.v4(),
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      date: this.taskForm.value.date,
      status: false
    };
    console.log("add ", task);
    this.tasks = [task].concat(this.tasks);
    this.formReset();
  }

  getTask(task: ITask) {
    this.isEditForm = true;
    this.task = task;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      date: task.date
    });
  }

  editTask() {
    let task = {
      id: uuid.v4(),
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      date: this.taskForm.value.date,
      status: this.taskForm.value.status
    };
    this.tasks = this.tasks.filter(t => t.id !== this.task.id);
    this.tasks.push(task);
    this.formReset();
    this.isEditForm = false;
  }

  deleteTask(task: ITask) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
  }

  formReset() {
    this.taskForm.reset();
    for (let control in this.taskForm.controls) {
      if (control !== 'title' && control !== 'date')
        this.taskForm.controls[control].setErrors(null);
    }
  }

  sort() {
    this.isAscending ? this.sortAscending() : this.sortDescending();
  }

  sortAscending() {
    this.isAscending = false;
    this.tasks = this.tasks.sort((t1, t2) => {
      if (t1.date < t2.date) {
        return 1;
      }
      if (t1.date > t2.date) {
        return -1;
      }
      return 0;
    });
  }

  sortDescending() {
    this.isAscending = true
    this.tasks = this.tasks.sort((t1, t2) => {
      if (t1.date > t2.date) {
        return 1;
      }
      if (t1.date < t2.date) {
        return -1;
      }
      return 0;
    });
  }

}
