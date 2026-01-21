import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Configuracion } from "./models/configuracion";

@Component({
	selector: "app-root",
	imports: [RouterOutlet],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("new-app");
	public mostrar_videojuegos: boolean = true;
	public titulo: string;
	public descripcion: string;

	constructor() {
		this.titulo = Configuracion.titulo;
		this.descripcion = Configuracion.descripcion;
	}

	public ocultarVideojuegos() {
		this.mostrar_videojuegos = !this.mostrar_videojuegos;
	}
}
