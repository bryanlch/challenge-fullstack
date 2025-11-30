import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon'; // Opcional para decorar
import { UserService } from '../../../../core/services/user.service';
import { Task } from '../../../../core/models/task.model';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './task-dialog.component.html',
  styles: [`
    .full-width { width: 100%; }
    .supervisor-info {
      background-color: #e3f2fd;
      color: #0d47a1;
      border-left: 4px solid #1976d2;
    }
  `]
})
export class TaskDialogComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<TaskDialogComponent>);

  public data = inject<{ task?: Task & { supervisorId?: string }, currentUserId: string }>(MAT_DIALOG_DATA);

  public users = toSignal(this.userService.getUsers(), { initialValue: [] });

  public supervisorInfo = computed(() => {
    const supervisorId = this.data.task?.supervisorId;
    if (!supervisorId) return null;

    if (supervisorId === this.data.currentUserId) return null

    return this.users().find(u => u.uid === supervisorId) || null;
  });

  public isEditMode = !!this.data.task;
  public isSupervisorMode = signal(false);

  public form = this.fb.group({
    title: [this.data.task?.title || '', Validators.required],
    description: [this.data.task?.description || '', Validators.required],
    status: [this.data.task?.status || 'pending'],
    asSupervisor: [false],
    assignedToId: [this.data.task?.assignedToId || this.data.currentUserId, Validators.required]
  });

  constructor() {
    this.initFormLogic();
  }

  private initFormLogic() {
    if (this.isEditMode && this.data.task?.assignedToId !== this.data.currentUserId) {
      this.isSupervisorMode.set(true);
      this.form.patchValue({ asSupervisor: true }, { emitEvent: false });
    }

    this.form.get('asSupervisor')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(isSuper => {
        this.isSupervisorMode.set(!!isSuper);
        const assignedTo = isSuper ? null : this.data.currentUserId;
        this.form.patchValue({ assignedToId: assignedTo });
      });
  }

  onSave() {
    if (this.form.valid) {
      const { asSupervisor, ...taskData } = this.form.value;
      this.dialogRef.close(taskData);
    }
  }
}