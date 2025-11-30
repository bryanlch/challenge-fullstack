import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskBoardComponent } from './task-board.component';
import { Task, TaskWithAction } from '../../../../core/models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskBoardComponent (refactorizado)', () => {
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

  // -----------------------------
  // COLUMNS
  // -----------------------------
  it('debe dividir tareas en las 3 columnas correctas', () => {
    const [pending, progress, completed] = component.columns;

    expect(pending.items.length).toBe(1);
    expect(progress.items.length).toBe(1);
    expect(completed.items.length).toBe(1);
  });

  it('debe mostrar botón Edit cuando el task NO está completado y no es readOnly', () => {
    const task = mockTasks[0];
    component.isReadOnly = false;

    expect(component.showButtonEdit(task)).toBeTrue();
  });

  it('no debe mostrar botón Edit cuando el task está completado', () => {
    const task = mockTasks[2];

    expect(component.showButtonEdit(task)).toBeFalse();
  });

  it('debe mostrar botón Delete si assignedToId == supervisorId', () => {
    const task = {
      ...mockTasks[0],
      action: 'delete',
      assignedToId: '5',
      supervisorId: '5'
    };

    expect(component.showButtonDelete(task)).toBeTrue();
  });

  it('debe mostrar botón Delete cuando es readOnly', () => {
    component.isReadOnly = true;

    const task = mockTasks[0];
    expect(component.showButtonDelete(task)).toBeTrue();
  });

  it('debe emitir un evento EDIT al hacer click en una card si no es readOnly', () => {
    spyOn(component.taskClick, 'emit');
    component.isReadOnly = false;

    const task = mockTasks[0];
    component.onCardClick(task);

    expect(component.taskClick.emit).toHaveBeenCalledWith({
      ...task,
      action: 'edit'
    });
  });

  it('NO debe emitir evento edit si es readOnly', () => {
    spyOn(component.taskClick, 'emit');
    component.isReadOnly = true;

    const task = mockTasks[0];
    component.onCardClick(task);

    expect(component.taskClick.emit).not.toHaveBeenCalled();
  });

  it('debe emitir un evento DELETE al hacer click en el botón', () => {
    spyOn(component.taskClick, 'emit');

    const task = mockTasks[0];
    component.onDeleteClick(task);

    expect(component.taskClick.emit).toHaveBeenCalledWith({
      ...task,
      action: 'delete'
    });
  });

  it('debe renderizar 3 columnas en el DOM', () => {
    const cols = fixture.debugElement.queryAll(By.css('.col-md-4'));
    expect(cols.length).toBe(3);
  });

  it('debe renderizar todas las cards de tareas', () => {
    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(cards.length).toBe(3);
  });
});