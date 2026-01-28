import { Component } from "@angular/core";
import { PeticionesService } from "../../services/peticiones-service";

@Component({
	selector: "app-externo",
	imports: [],
	providers: [PeticionesService],
	templateUrl: "./externo.html",
	styleUrl: "./externo.css",
})
export class Externo {
	public user: any;

	constructor(private _peticionesServices: PeticionesService) {}

	ngOnInit() {
		this._peticionesServices.getUser().subscribe({
			next: (result) => {
				this.user = result;
				this.user = this.user.results[0];
                console.log(this.user);
			},
			error: (error) => {
				console.error(error);
			},
		});
	}
}
