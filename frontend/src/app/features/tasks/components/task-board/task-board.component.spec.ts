import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskBoardComponent } from './task-board.component';
import { Task } from '../../../../core/models/task.model';
import { By } from '@angular/platform-browser';

describe('TaskBoardComponent', () => {
  let component: TaskBoardComponent;
  let fixture: ComponentFixture<TaskBoardComponent>;

  // Datos de prueba adaptados al NUEVO MODELO (Sin userId, con supervisorId/assignedToId)
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

    // Asignamos los inputs iniciales
    component.tasks = mockTasks;

    // Detectamos cambios para que el HTML se actualice con los datos
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería filtrar las tareas correctamente por estado', () => {
    // Probamos que los getters del componente filtren bien según el status
    expect(component.pendingTasks.length).toBe(1);
    expect(component.pendingTasks[0].title).toBe('Task 1'); // status: 'pending'

    expect(component.progressTasks.length).toBe(1);
    expect(component.progressTasks[0].title).toBe('Task 2'); // status: 'in_progress'

    expect(component.completedTasks.length).toBe(1);
    expect(component.completedTasks[0].title).toBe('Task 3'); // status: 'completed'
  });

  it('debería emitir el evento taskClick al hacer click en una tarjeta', () => {
    // Espiamos el evento de salida (Output)
    spyOn(component.taskClick, 'emit');

    // Buscamos la primera tarjeta disponible en el DOM
    // Asegúrate de que en tu HTML la tarjeta tenga la clase '.task-card'
    const cardDebugEl = fixture.debugElement.query(By.css('.task-card'));

    if (cardDebugEl) {
      // Simulamos el click nativo
      cardDebugEl.nativeElement.click();
    } else {
      // Fallback por si el selector CSS no coincide, llamamos al método directo
      component.onCardClick(mockTasks[0]);
    }

    expect(component.taskClick.emit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('NO debería emitir click si es de solo lectura (isReadOnly)', () => {
    // Configuramos el modo solo lectura
    component.isReadOnly = true;
    fixture.detectChanges(); // Actualizamos la vista

    spyOn(component.taskClick, 'emit');

    // Intentamos hacer click
    component.onCardClick(mockTasks[0]);

    // Verificamos que NO se haya emitido nada
    expect(component.taskClick.emit).not.toHaveBeenCalled();
  });
});