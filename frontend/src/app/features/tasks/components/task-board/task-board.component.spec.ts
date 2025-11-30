import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskBoardComponent } from './task-board.component';
import { Task, TaskWithAction } from '../../../../core/models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskBoardComponent', () => {
  let component: TaskBoardComponent;
  let fixture: ComponentFixture<TaskBoardComponent>;

  const mockTasks: TaskWithAction[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'pending',
      supervisorId: 'sup-1',
      assignedToId: 'user-1',
      action: 'edit',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'in_progress',
      supervisorId: 'sup-1',
      assignedToId: 'user-1',
      action: 'edit',
      createdAt: new Date()
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: 'completed',
      supervisorId: 'sup-1',
      assignedToId: 'user-1',
      action: 'edit',
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskBoardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskBoardComponent);
    component = fixture.componentInstance;

    component.tasks = mockTasks;
    fixture.detectChanges();
  });

  it('should divide tasks into correct columns', () => {
    const [pending, progress, completed] = component.columns;

    expect(pending.items.length).toBe(1);
    expect(progress.items.length).toBe(1);
    expect(completed.items.length).toBe(1);
  });

  it('should show Edit button when task is NOT completed and not readOnly', () => {
    const task = mockTasks[0];
    component.isReadOnly = false;

    expect(component.showButtonEdit(task)).toBeTrue();
  });

  it('should not show Edit button when task is completed', () => {
    const task = mockTasks[2];

    expect(component.showButtonEdit(task)).toBeFalse();
  });

  it('should show Delete button if assignedToId == supervisorId', () => {
    const task = {
      ...mockTasks[0],
      action: 'delete',
      assignedToId: '5',
      supervisorId: '5'
    };

    expect(component.showButtonDelete(task)).toBeTrue();
  });

  it('should show Delete button when readOnly', () => {
    component.isReadOnly = true;

    const task = mockTasks[0];
    expect(component.showButtonDelete(task)).toBeTrue();
  });

  it('should emit EDIT event when clicking a card if not readOnly', () => {
    spyOn(component.taskClick, 'emit');
    component.isReadOnly = false;

    const task = mockTasks[0];
    component.onCardClick(task);

    expect(component.taskClick.emit).toHaveBeenCalledWith({
      ...task,
      action: 'edit'
    });
  });

  it('should NOT emit edit event if readOnly', () => {
    spyOn(component.taskClick, 'emit');
    component.isReadOnly = true;

    const task = mockTasks[0];
    component.onCardClick(task);

    expect(component.taskClick.emit).not.toHaveBeenCalled();
  });

  it('should emit DELETE event when clicking the button', () => {
    spyOn(component.taskClick, 'emit');

    const task = mockTasks[0];
    component.onDeleteClick(task);

    expect(component.taskClick.emit).toHaveBeenCalledWith({
      ...task,
      action: 'delete'
    });
  });

  it('should render 3 columns in the DOM', () => {
    const cols = fixture.debugElement.queryAll(By.css('.col-md-4'));
    expect(cols.length).toBe(3);
  });

  it('should render all task cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(cards.length).toBe(3);
  });
});