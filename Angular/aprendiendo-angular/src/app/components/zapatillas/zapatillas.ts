import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Zapatilla } from "../../models/Zapatilla";

@Component({
	selector: "app-zapatillas",
	imports: [RouterLink, FormsModule],
	templateUrl: "./zapatillas.html",
	styleUrl: "./zapatillas.css",
})
export class Zapatillas {
	public titulo: string;
	public zapatillas: Array<Zapatilla>;
	public marcas: string[];
	public color: string;
	public miMarca: string;

	constructor() {
		this.titulo = "Componente Zapatillas";
		this.zapatillas = [
			new Zapatilla("Reebok Classic", "Reebok", "Blanco", 80, true),
			new Zapatilla("Nike MD Runner", "Nike", "Negro", 60, true),
			new Zapatilla("Adidas Yeezy", "Adidas", "Gris", 180, false),
		];
		this.marcas = [];
		this.color = "yellow";
		this.miMarca = "Champion";
	}

	ngOnInit() {
		console.log(this.zapatillas);

		this.getMarcas();
	}

	getMarcas() {
		this.zapatillas.forEach((zapatilla, index) => {
			if (this.marcas.indexOf(zapatilla.marca) < 0) {
				this.marcas.push(zapatilla.marca);
			}

			console.log(index);
		});

		console.log(this.marcas);
	}

	getMarca() {
		alert(this.miMarca);
	}

	addMarca() {
		this.marcas.push(this.miMarca);
	}

	borrarMarca(index: number) {
		this.marcas.splice(index, 1);
	}

	onBlur() {
		console.log("Has salido del campo de marcas");
	}

	mostrarPalabra() {
		alert(this.miMarca);
	}
}
