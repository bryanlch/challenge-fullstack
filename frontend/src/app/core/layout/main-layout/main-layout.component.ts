import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe, DatePipe, UpperCasePipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.authService.user$;

  today = new Date();

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}