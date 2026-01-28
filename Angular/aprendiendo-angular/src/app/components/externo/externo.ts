import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PeticionesService } from "../../services/peticiones-service";

@Component({
	selector: "app-externo",
	imports: [RouterLink],
	providers: [PeticionesService],
	templateUrl: "./externo.html",
	styleUrl: "./externo.css",
})
export class Externo {
	public user: any;

	constructor(private _peticionesServices: PeticionesService) {}

	ngOnInit() {
		this.cargarUsuario();
	}

	cargarUsuario() {
		this._peticionesServices.getUser().subscribe({
			next: (result) => {
				this.user = result;
				console.log(this.user);
				this.user = this.user.results[0];
			},
			error: (error) => {
				console.error(error);
			},
		});
	}
}
