import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskBoardComponent } from './task-board.component';
import { Task } from '../../../../core/models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskBoardComponent (refactorizado)', () => {
  let component: TaskBoardComponent;
  let fixture: ComponentFixture<TaskBoardComponent>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'pending',
      supervisorId: 'sup-1',
      assignedToId: 'user-1',
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'in_progress',
      supervisorId: 'sup-1',
      assignedToId: 'user-1',
      createdAt: new Date()
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: 'completed',
      supervisorId: 'sup-1',
      assignedToId: 'user-1',
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

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería generar correctamente las columnas dinámicas', () => {
    const cols = component.columns;

    expect(cols.length).toBe(3);

    expect(cols[0].label).toBe('Pendientes');
    expect(cols[0].items.length).toBe(1);

    expect(cols[1].label).toBe('En Curso');
    expect(cols[1].items.length).toBe(1);

    expect(cols[2].label).toBe('Completadas');
    expect(cols[2].items.length).toBe(1);
  });

  it('debería renderizar las tarjetas en el DOM', () => {
    const cards = fixture.debugElement.queryAll(By.css('.task-card'));
    expect(cards.length).toBe(3);
  });

  it('debería emitir el evento taskClick al hacer click en una tarjeta', () => {
    spyOn(component.taskClick, 'emit');

    const firstCard = fixture.debugElement.query(By.css('.task-card'));
    firstCard.nativeElement.click();

    expect(component.taskClick.emit).toHaveBeenCalledOnceWith(mockTasks[0]);
  });

  it('NO debería emitir evento si isReadOnly = true', () => {
    component.isReadOnly = true;
    fixture.detectChanges();

    spyOn(component.taskClick, 'emit');

    const firstCard = fixture.debugElement.query(By.css('.task-card'));
    firstCard.nativeElement.click();

    expect(component.taskClick.emit).not.toHaveBeenCalled();
  });
});
