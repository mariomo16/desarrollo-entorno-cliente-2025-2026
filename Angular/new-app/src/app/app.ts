import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { VideojuegoComponent } from "./components/videojuego-component/videojuego-component";
import { ZapatillasComponent } from "./components/zapatillas-component/zapatillas-component";

@Component({
	selector: "app-root",
	imports: [
		RouterOutlet,
		CommonModule,
		VideojuegoComponent,
		ZapatillasComponent,
	],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("new-app");
	public mostrar_videojuegos: boolean = true;

	public ocultarVideojuegos() {
		this.mostrar_videojuegos = !this.mostrar_videojuegos;
	}
}
