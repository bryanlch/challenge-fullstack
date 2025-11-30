import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Task, TaskWithAction } from '../../../../core/models/task.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {
  @Input() tasks: Task[] = [];
  @Input() isReadOnly = false;
  @Output() taskClick = new EventEmitter<TaskWithAction>();

  get columns() {
    return [
      {
        label: 'Pendientes',
        items: this.filterBy('pending'),
        class: 'pending-col',
        titleClass: 'text-dark'
      },
      {
        label: 'En Curso',
        items: this.filterBy('in_progress'),
        class: 'progress-col',
        titleClass: 'text-dark'
      },
      {
        label: 'Completadas',
        items: this.filterBy('completed'),
        class: 'completed-col',
        titleClass: 'text-dark'
      }
    ];
  }

  private filterBy(status: string) {
    return this.tasks.filter(t => t.status === status);
  }

  getShort(text: string): string {
    const max = 35;
    return text.length > max ? text.substring(0, max) + '...' : text;
  }

  showButtonEdit(task: Task): boolean {
    if (task.assignedToId === task.supervisorId)
      return task.status !== 'completed';

    return !this.isReadOnly && task.status !== 'completed';
  }

  showButtonDelete(task: Task): boolean {
    if (task.assignedToId === task.supervisorId)
      return true;

    return this.isReadOnly;
  }

  onCardClick(task: Task) {
    if (!this.isReadOnly) this.taskClick.emit({
      ...task,
      action: 'edit'
    });
  }

  onDeleteClick(task: Task) {
    this.taskClick.emit({
      ...task,
      action: 'delete'
    });
  }
}