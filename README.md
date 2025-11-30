# 🚀 Task Management System (Challenge Full Stack)

Aplicación integral de gestión de tareas con roles de supervisión y tablero interactivo, desarrollada con **Angular 17+** y **Firebase Cloud Functions**.

---

## 📋 Descripción del Proyecto
Este sistema permite gestionar flujos de trabajo colaborativos. A diferencia de una lista de tareas tradicional, esta solución implementa un **Tablero Kanban** visual donde se pueden gestionar estados (Pendiente, En Curso, Completado) y asignar tareas a otros usuarios bajo un rol de supervisión. 

Cumple con los requerimientos técnicos de escalabilidad, seguridad y calidad de código solicitados en el challenge.

---

## 🔗 Demo en Vivo
[**Abrir Aplicación**](https://challenge-to-do.web.app)

## 🏗 Arquitectura y Diseño

El proyecto sigue un **monorepo manual** que unifica Frontend y Backend para facilitar el despliegue con `firebase deploy`.  

### Backend (Clean Architecture & DDD)
Se desacopló la lógica en capas estrictas para cumplir con principios **SOLID**:
* **Domain:** Entidades (`Task`, `User`) y Contratos (Interfaces). Sin dependencias externas.
* **Application:** Casos de Uso (`CreateTaskUseCase`, `CheckUserUseCase`). Lógica pura de negocio.
* **Infrastructure:** Implementación real (Firestore Repository, Express Controllers).
* **Patrones:** Repository Pattern, Factory, Singleton (Firebase Instance).

### Middleware de Seguridad
- **CORS:** Controla orígenes permitidos y manejo de credenciales.
- **Helmet:** Protege headers HTTP.
- **Rate Limit:** Limita peticiones (200/min) para prevenir abusos.
- **Express JSON / URL Encoded:** Parseo de requests con límite de 10MB.

### Frontend (Angular 17 - Component Based)
- **Architecture:** Standalone Components (sin NgModules).
- **State Management:** Angular Signals para reactividad granular y alto rendimiento.
- **UI Library:** Angular Material + Bootstrap (para diseño y comportamientos móviles).
- **Lazy Loading:** Optimización de bundle cargando módulos bajo demanda.

---

## 🌟 Features Destacados
- **Tablero Kanban:** Visualización de tareas por columnas de estado.
- **Gestión de Roles:** Auto-asignación y asignación de tareas a terceros (rol Supervisor).
- **Filtros Inteligentes:** Separación automática de "Mis Tareas" y "Tareas Supervisadas".
- **Seguridad Híbrida:** Firebase Auth + validación de tokens JWT en Backend.

---

## 🛠 Stack Tecnológico

**Frontend**
- Angular 17.3  
- Angular Material + Bootstrap 5  
- Karma + Jasmine para tests  

**Backend**
- Node.js 20 (Cloud Functions Gen 2)  
- Express.js  
- Firestore (NoSQL)  
- Jest + ts-jest para pruebas unitarias  

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js v18+  
- Java JDK 21+ (para emuladores Firebase)  
- Firebase CLI (`npm install -g firebase-tools`)  

### Pasos
1. **Clonar repositorio**
```bash
git clone <URL_TU_REPO>
cd challenge-fullstack
```
2. **Instalar dependencias**
```bash
npm install                   # Raíz
cd functions && npm install   # Backend
cd ../frontend && npm install # Frontend
```
3. **Ejecutar en modo desarrollo**
```bash
npm run dev:watch #carpeta raiz
```
Esto levantará:
- Backend API: `http://localhost:5001/...`
- Firestore Emulator: `localhost:8085`
- Emulator UI: `http://localhost:4000`

4. **Ejecutar Frontend**
```bash
cd frontend
ng serve
```
Abrir navegador en `http://localhost:4200`.

### Configuración de Firebase
Este proyecto utiliza **Firebase propio**. Para probarlo con tu proyecto:
1. Crear un proyecto en Firebase.  
2. Reemplazar las variables de entorno en `frontend/src/environments/environment.example.ts` y  `cp src/environments/environment.example.ts src/environments/environment.ts` ya con tus credenciales configuradas.  
3. Ejecutar los scripts locales.

---

## 🧪 Testing

#### Ejecutar tests de Backend
- Backend: 100% Unit Testing en Casos de Uso usando Mocks de Firestore.
- cd functions && npm test

#### Ejecutar tests de Frontend
- Frontend: Tests de componentes críticos.  
- cd frontend && ng test

---

## 📂 Estructura de Tests
- Estrategia de **co-locación:** los `.spec.ts` residen junto al código que prueban.  
- Facilita mantenimiento, visibilidad y uso de mocks locales.  
- Jest configurado para ignorar la carpeta de compilación (`/lib`).  

---

## ⚙️ CI/CD (GitHub Actions)
- Instala dependencias del Frontend.  
- Crea `environment.ts` y `environment.prod.ts` a partir de secrets.  
- Construye Frontend en modo producción.  
- Backend se despliega automáticamente en Firebase.

```yaml
# Ejemplo simplificado del workflow
- name: Install Frontend
  run: cd frontend && npm ci

- name: Create Environment File
  run: cd frontend/src/environments && echo "..." > environment.example.ts

- name: Build Frontend
  run: cd frontend && npx ng build --configuration production
```

---

## ⚠️ Limitaciones
- Control de permisos no implementado (solo autenticación básica).  
- Proyecto desarrollado como **challenge**; funcionalidad limitada a demostración de gestión de tareas y buenas prácticas técnicas.