import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { VideojuegoComponent } from "./components/videojuego-component/videojuego-component";
import { ZapatillasComponent } from "./components/zapatillas-component/zapatillas-component";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, VideojuegoComponent, ZapatillasComponent],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("new-app");
}
