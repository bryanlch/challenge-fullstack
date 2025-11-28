import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'app/tasks',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'tasks',
                loadComponent: () => import('./features/tasks/pages/task-list/task-list.component')
                    .then(m => m.TaskListComponent)
            },
            { path: '', redirectTo: 'tasks', pathMatch: 'full' }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];