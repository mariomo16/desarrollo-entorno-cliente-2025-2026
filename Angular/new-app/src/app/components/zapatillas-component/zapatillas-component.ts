import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-zapatillas-component",
	imports: [FormsModule],
	templateUrl: "./zapatillas-component.html",
	styleUrl: "./zapatillas-component.css",
})
export class ZapatillasComponent {
	public titulo: string;
	public zapatillas: Array<Zapatilla>;
	public marcas: String[];
	public color: string;
	public mi_marca: string;

	constructor() {
		this.titulo = "Componente Zapatillas";
		this.zapatillas = [
			new Zapatilla("Reebook Classic", "Reebook", "Blanco", 80, true),
			new Zapatilla("Nike Runner MD", "Nike", "Negro", 60, true),
			new Zapatilla("Adidas Yezzy", "Adidas", "Gris", 180, false),
		];
		this.color = "yellow";
		this.mi_marca = "";
	}
}
