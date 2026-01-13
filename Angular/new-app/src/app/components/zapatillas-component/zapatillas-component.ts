import { Component } from "@angular/core";

@Component({
	selector: "app-zapatillas-component",
	imports: [],
	templateUrl: "./zapatillas-component.html",
	styleUrl: "./zapatillas-component.css",
})
export class ZapatillasComponent {
	public titulo: string;

	constructor() {
		this.titulo = "Componente de Zapatillas";
	}
}
