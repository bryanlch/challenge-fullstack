import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components & Services
import { TaskBoardComponent } from '../../components/task-board/task-board.component';
import { TaskDialogComponent } from '../../components/task-dialog/task-dialog.component';
import { TaskService } from '../../../../core/services/task.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Task, TaskWithAction } from '../../../../core/models/task.model';
import { switchMap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressBarModule,
    TaskBoardComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  currentUserId = signal<string>('');

  myTasks = computed(() =>
    this.tasks().filter(t => t.assignedToId === this.currentUserId())
  );

  supervisedTasks = computed(() =>
    this.tasks().filter(t =>
      t.supervisorId === this.currentUserId() &&
      t.assignedToId !== this.currentUserId()
    )
  );

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.currentUserId.set(user.uid);
        this.startPolling();
      }
    });
  }

  loadTasks() {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.showError('Error cargando las tareas');
        this.loading.set(false);
      }
    });
  }

  startPolling() {
    timer(0, 10000)
      .pipe(
        switchMap(() => this.taskService.getTasks()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          this.tasks.set(data);
          if (this.loading()) this.loading.set(false);
        },
        error: (err) => console.error('Error en polling', err)
      });
  }

  openTaskDialog(task?: TaskWithAction) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        task: task || null,
        currentUserId: this.currentUserId()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.loading.set(true);

      if (!task?.action) {
        const newTaskPayload = {
          ...result,
          supervisorId: this.currentUserId()
        };

        this.taskService.createTask(newTaskPayload).subscribe({
          next: () => {
            this.loadTasks();
            this.showSuccess('Tarea creada exitosamente');
          },
          error: () => {
            this.showError('Error creando la tarea');
            this.loading.set(false);
          }
        });
      }

      if (task?.action === 'edit') {
        this.taskService.updateTask(task.id, result).subscribe({
          next: () => {
            this.loadTasks();
            this.showSuccess('Tarea actualizada correctamente');
          },
          error: () => {
            this.showError('Error actualizando la tarea');
            this.loading.set(false);
          }
        });

      }

      if (task?.action === 'delete') {
        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            this.loadTasks();
            this.showSuccess('Tarea eliminada correctamente');
          },
          error: () => {
            this.showError('Error eliminando la tarea');
            this.loading.set(false);
          }
        });
      }
    });
  }

  // Helpers para notificaciones
  private showSuccess(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000, panelClass: 'success-snack' });
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 4000, panelClass: 'error-snack' });
  }
}