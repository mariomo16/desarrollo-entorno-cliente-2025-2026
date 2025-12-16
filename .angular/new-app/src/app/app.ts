import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideojuegoComponent } from './components/videojuego-component/videojuego-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VideojuegoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('new-app');
}
