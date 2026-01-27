import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-videojuegos",
	imports: [RouterLink],
	templateUrl: "./videojuegos.html",
	styleUrl: "./videojuegos.css",
})
export class Videojuegos {
	public titulo: string;
	public listado: string;

	constructor() {
		this.titulo = "Componente Videojuegos";
		this.listado = "Listado de los juegos más populares";

		console.log("Se ha cargado el componente: videojuego.ts");
	}

	public cambiarTitulo(nuevoTitulo: string) {
		this.titulo = nuevoTitulo;
	}

	ngOnInit() {
		console.log("OnInit ejecutado");
	}

	ngDoCheck() {
		console.log("DoCheck ejecutado");
	}
}
