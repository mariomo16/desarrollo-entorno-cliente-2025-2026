import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
// import { Videojuegos } from "./components/videojuegos/videojuegos";
// import { Zapatillas } from "./components/zapatillas/zapatillas";
import { Configuracion } from "./models/Configuracion";

@Component({
	selector: "app-root",
	imports: [RouterOutlet],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("aprendiendo-angular");
	public titulo: string;
	public descripcion: string;
	public mostrarVideojuegos: boolean = true;
    public config;

	constructor() {
        this.config = Configuracion;
		this.titulo = Configuracion.titulo;
		this.descripcion = Configuracion.descripcion;
	}

	toggleVideojuegos() {
		this.mostrarVideojuegos = !this.mostrarVideojuegos;
	}
}
