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

  get pendingTasks() { return this.tasks.filter(t => t.status === 'pending'); }
  get progressTasks() { return this.tasks.filter(t => t.status === 'in_progress'); }
  get completedTasks() { return this.tasks.filter(t => t.status === 'completed'); }

  onCardClick(task: Task) {
    if (!this.isReadOnly) {
      this.taskClick.emit(task);
    }
  }
}