# 🚀 Task Management System (Challenge Full Stack)

Aplicación integral de gestión de tareas con roles de supervisión, desarrollada con **Angular 17+** y **Firebase Cloud Functions**.

## 📋 Descripción
Sistema diseñado para gestionar flujos de trabajo en equipo. Permite crear tareas, asignarlas a otros usuarios (rol supervisor) o auto-asignarlas. Implementa un tablero Kanban interactivo con estados (Pendiente, En Curso, Completado).

## 🏗 Arquitectura y Diseño
El proyecto sigue una **Clean Architecture** estricta en el Backend y **Component-Based Architecture** en el Frontend.



[Image of Clean Architecture Diagram]


### Backend (Node.js + Express + Firebase)
[cite_start]Se desacopló la lógica en capas para cumplir con principios **SOLID** y **DDD**[cite: 102]:
* **Domain:** Entidades (`Task`, `User`) y Contratos de Repositorios (Interfaces). No tiene dependencias externas.
* **Application:** Casos de Uso (`CreateTaskUseCase`, `CheckUserUseCase`). Contiene la lógica pura de negocio.
* **Infrastructure:** Implementación real (Firestore, Express Controllers, Rutas).

### Frontend (Angular 17)
* **Standalone Components:** Arquitectura moderna sin `NgModules`.
* **Signals:** Manejo de estado reactivo granular para alto rendimiento (evitando `Zone.js` overhead).
* **Separation of Concerns:** Lógica delegada en Servicios y Guards.

## 🛠 Stack Tecnológico

### Frontend
* **Framework:** Angular 17.3
* **UI Library:** Angular Material (Dialogs, Chips, Toolbar) + Bootstrap 5 (Grid System).
* **Estilos:** SCSS con arquitectura BEM y variables.
* **Reactive:** RxJS + Angular Signals.

### Backend
* **Runtime:** Node.js 20+ en Cloud Functions (Gen 2).
* **Framework:** Express.js (dentro de Cloud Functions).
* **Lenguaje:** TypeScript estricto.
* **Patrones:** Repository Pattern, Singleton (Firebase Instance), Factory (Use Cases).

### Herramientas y Paquetes Clave
* `concurrently`: Para ejecutar emuladores y compilación en paralelo (Hot Reload).
* `firebase-admin`: SDK para gestión segura de Firestore y Auth.
* `npx kill-port`: Utilidad para gestión de puertos en desarrollo.

## 🚀 Instalación y Ejecución

### Prerrequisitos
* Node.js v18+
* Java JDK 21+ (Para emuladores de Firebase)
* Firebase CLI (`npm install -g firebase-tools`)

### Pasos
1.  **Clonar repositorio:**
    ```bash
    git clone <URL_REPO>
    cd challenge-to-do
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install                   # Raíz
    cd functions && npm install   # Backend
    cd ../frontend && npm install # Frontend
    ```

3.  **Ejecutar en modo Desarrollo (Hot Reload):**
    Desde la raíz:
    ```bash
    npm run dev:watch
    ```
    *Esto levantará el Backend en `localhost:5001` y Firestore en `localhost:8080`.*

4.  **Ejecutar Frontend:**
    En otra terminal:
    ```bash
    cd frontend
    ng serve
    ```
    *Abrir navegador en `http://localhost:4200`.*

## 🧪 Testing
Se incluyen pruebas unitarias para servicios y casos de uso.
* **Backend:** `cd functions && npm test`
* **Frontend:** `cd frontend && ng test`

## 🔒 Seguridad
* **Middleware JWT:** Validación de tokens de Firebase Auth en cada petición al Backend.
* **Guards:** Protección de rutas `/app/*` en el Frontend.
* **Data Isolation:** Consultas a Firestore filtradas por `userId` o `supervisorId`.