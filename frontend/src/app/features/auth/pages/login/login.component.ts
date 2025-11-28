import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { RegisterDialogComponent } from '../../components/register-dialog/register-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  step = signal<'email' | 'password'>('email');

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  passwordForm = this.fb.group({
    password: ['', Validators.required]
  });

  async checkUser() {
    if (this.emailForm.invalid) return;

    const email = this.emailForm.value.email!;
    this.loading.set(true);

    this.userService.checkUserExists(email).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.exists) {
          this.step.set('password');
        } else {
          this.openRegisterDialog(email);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open('Error conectando con el servidor', 'Cerrar', { duration: 5000 });
      }
    });
  }

  login() {
    if (this.passwordForm.invalid) return;

    const email = this.emailForm.value.email!;
    const password = this.passwordForm.value.password!;
    this.loading.set(true);

    this.authService.loginWithEmail(email, password).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openRegisterDialog(email: string) {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '400px',
      data: { email }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.handleRegistration(email, result);
      }
    });
  }

  private handleRegistration(email: string, data: any) {
    this.loading.set(true);
    this.authService.registerWithEmail(email, data.password).subscribe({
      next: () => {
        this.userService.createProfile({
          name: data.name,
          lastname: data.lastname,
          email: email
        }).subscribe({
          next: () => {
            this.snackBar.open('¡Cuenta creada!', 'OK', { duration: 3000 });
            this.loading.set(false);
            this.router.navigate(['/tasks']).then(() => console.log("NAVEGÓ"));
          },
          error: () => {
            this.loading.set(false);
            this.snackBar.open('Error guardando perfil', 'Cerrar');
          }
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open('Error creando cuenta en Firebase: ' + err.message, 'Cerrar');
      }
    });
  }

  goBack() {
    this.step.set('email');
    this.passwordForm.reset();
  }
}