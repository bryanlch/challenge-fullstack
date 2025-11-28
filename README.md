# 🚀 Task Management System (Challenge Full Stack)

Aplicación integral de gestión de tareas con roles de supervisión y tablero interactivo, desarrollada con **Angular 17+** y **Firebase Cloud Functions**.

## 📋 Descripción del Proyecto
Este sistema permite gestionar flujos de trabajo colaborativos. A diferencia de una lista de tareas tradicional, esta solución implementa un **Tablero Kanban** visual donde se pueden gestionar estados (Pendiente, En Curso, Completado) y asignar tareas a otros usuarios bajo un rol de supervisión.

[cite_start]Cumple con los requerimientos técnicos de escalabilidad, seguridad y calidad de código solicitados en el challenge[cite: 68, 69].

## 🏗 Arquitectura y Diseño

El proyecto sigue una estructura de **Monorepo** que unifica Frontend y Backend para facilitar el CI/CD.



[Image of Clean Architecture Diagram]


### 1. Backend (Clean Architecture & DDD)
[cite_start]Se desacopló la lógica en capas estrictas para cumplir con principios **SOLID**[cite: 36, 38]:
* **Domain:** Entidades (`Task`, `User`) y Contratos (Interfaces). Sin dependencias externas.
* **Application:** Casos de Uso (`CreateTaskUseCase`, `CheckUserUseCase`). Lógica pura de negocio.
* **Infrastructure:** Implementación real (Firestore Repository, Express Controllers).
* [cite_start]**Patrones:** Repository Pattern, Factory, Singleton (Firebase Instance)[cite: 40].

### 2. Frontend (Angular 17 - Component Based)
* [cite_start]**Architecture:** Standalone Components (Sin NgModules)[cite: 39].
* **State Management:** Uso nativo de **Angular Signals** para reactividad granular y alto rendimiento.
* **Separation of Concerns:** Lógica delegada en Servicios (`TaskService`, `AuthService`) y Guards (`AuthGuard`).
* [cite_start]**Lazy Loading:** Módulos cargados bajo demanda para optimizar el bundle[cite: 57].

## 🌟 Features Destacados (Valor Agregado)
* **Tablero Kanban:** Visualización de tareas por columnas de estado con indicadores de color translúcidos.
* **Gestión de Roles:** Sistema para auto-asignarse tareas o asignarlas a terceros (Rol Supervisor).
* **Filtros Inteligentes:** Separación automática entre "Mis Tareas" y "Tareas Supervisadas".
* [cite_start]**Seguridad Híbrida:** Autenticación delegada en Firebase Auth + Validación de Tokens JWT propios en el Backend[cite: 43].

## 🛠 Stack Tecnológico

### Frontend
* **Framework:** Angular 17.3
* **UI Library:** Angular Material (Dialogs, Selects, Toolbar) + Bootstrap 5 (Grid System).
* **Testing:** Karma + Jasmine (Configuración nativa robusta).

### Backend
* **Runtime:** Node.js 20 en Cloud Functions (Gen 2).
* **Framework:** Express.js sobre Cloud Functions.
* [cite_start]**Base de Datos:** Firestore (NoSQL)[cite: 23].
* **Testing:** Jest + ts-jest (Cobertura de controladores y casos de uso).

## 🚀 Instalación y Ejecución

### Prerrequisitos
* Node.js v18+
* Java JDK 21+ (Requerido para emuladores de Firebase actuales).
* Firebase CLI (`npm install -g firebase-tools`).

### Pasos
1.  **Clonar repositorio:**
    ```bash
    git clone <URL_TU_REPO>
    cd challenge-fullstack
    ```

2.  **Instalar dependencias (Script unificado):**
    ```bash
    npm install                   # Raíz
    cd functions && npm install   # Backend
    cd ../frontend && npm install # Frontend
    ```

3.  **Ejecutar en modo Desarrollo (Hot Reload):**
    Desde la raíz, ejecuta el script que levanta emuladores y compilador:
    ```bash
    npm run dev:watch
    ```
    *Esto levantará:*
    * Backend API: `http://localhost:5001/...`
    * Firestore Emulator: `localhost:8085`
    * Emulator UI: `http://localhost:4000`

4.  **Ejecutar Frontend:**
    En otra terminal:
    ```bash
    cd frontend
    ng serve
    ```
    *Abrir navegador en `http://localhost:4200`.*

## 🧪 Testing (Cobertura > 75%)
[cite_start]El proyecto incluye pruebas unitarias tanto para lógica de negocio como para componentes visuales[cite: 51].

### Backend (Jest)
Pruebas de Controladores y Casos de Uso.
```bash
cd functions
npm run test:coverage