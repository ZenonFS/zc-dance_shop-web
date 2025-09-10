import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [CardModule, ButtonModule, PasswordModule, InputTextModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  username: string = '';
  password: string = '';

  constructor(private readonly router: Router) {}

  login() {
    // Implement your login logic here
    console.log('Logging in with', this.username, this.password);
    this.router.navigate(['/admin']);
  }
}
