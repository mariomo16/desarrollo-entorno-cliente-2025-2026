import { Component, OnInit, DoCheck, OnDestroy } from "@angular/core";

@Component({
	selector: "app-videojuego-component",
	imports: [],
	templateUrl: "./videojuego-component.html",
	styleUrl: "./videojuego-component.css",
})
export class VideojuegoComponent implements OnInit, DoCheck, OnDestroy {
	public titulo: string;
	public listado: string;

	constructor() {
		this.titulo = "Componente de Videojuegos";
		this.listado = "Listado de videojuegos";

		console.log("Se ha cargado el componente: videojuego.component.ts");
	}

	public cambiarTitulo(nuevoTitulo: string): void {
		this.titulo = nuevoTitulo;
	}

	// Se ejecuta al iniciar
	ngOnInit(): void {
		console.log("OnInit ejecutado");
	}

	// Parece que se ejecuta cada vez que se entra en esta clase
	ngDoCheck(): void {
		console.log("DoCheck ejecutado");
	}

	// Se ejecuta al destruir
	ngOnDestroy(): void {
		console.log("OnDestroy ejecutado");
	}
}
