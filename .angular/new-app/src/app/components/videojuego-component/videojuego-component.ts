import { Component } from "@angular/core";

@Component({
	selector: "app-videojuego-component",
	imports: [],
	templateUrl: "./videojuego-component.html",
	styleUrl: "./videojuego-component.css",
})
export class VideojuegoComponent {
	public titulo: string;
	public listado: string;

	constructor() {
		this.titulo = "Componente de Videojuegos";
		this.listado = "Listado de videojuegos";
	}

	public cambiarTitulo(nuevoTitulo: string): void {
		this.titulo = nuevoTitulo;
	}
}
