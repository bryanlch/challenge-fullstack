import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent {
  @Input() tasks: Task[] = [];
  @Input() isReadOnly = false;
  @Output() taskClick = new EventEmitter<Task>();

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

  onCardClick(task: Task) {
    if (!this.isReadOnly) this.taskClick.emit(task);
  }
}