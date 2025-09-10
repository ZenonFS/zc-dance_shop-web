import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cart } from '../domain/use-cases/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  providers: [Cart],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('zc dance_shop-web');
}
