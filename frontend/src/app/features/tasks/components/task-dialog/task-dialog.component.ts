import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../../core/services/user.service';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSlideToggleModule, MatSelectModule
  ],
  templateUrl: './task-dialog.component.html',
  styles: ['.full-width { width: 100%; }']
})
export class TaskDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  form: FormGroup;
  users$ = this.userService.getUsers();
  isSupervisorMode = signal(false);
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task, currentUserId: string }
  ) {
    this.isEditMode = !!data.task;

    this.form = this.fb.group({
      title: [data.task?.title || '', Validators.required],
      description: [data.task?.description || '', Validators.required],
      status: [data.task?.status || 'pending'],
      asSupervisor: [false],
      assignedToId: [data.task?.assignedToId || data.currentUserId, Validators.required]
    });
  }

  ngOnInit() {
    if (this.isEditMode && this.data.task?.assignedToId !== this.data.currentUserId) {
      this.isSupervisorMode.set(true);
      this.form.patchValue({ asSupervisor: true });
    }

    this.form.get('asSupervisor')?.valueChanges.subscribe(isSuper => {
      this.isSupervisorMode.set(isSuper);
      if (!isSuper) {
        this.form.patchValue({ assignedToId: this.data.currentUserId });
      } else {
        this.form.patchValue({ assignedToId: null });
      }
    });
  }

  onSave() {
    if (this.form.valid) {
      const { asSupervisor, ...taskData } = this.form.value;
      this.dialogRef.close(taskData);
    }
  }
}