import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-home",
	imports: [RouterLink],
	templateUrl: "./home.html",
	styleUrl: "./home.css",
})
export class Home {
    public identificado: boolean;

    constructor() {
        this.identificado = false;
    }

    ngOnInit() {
    }

    toggleIdentificado() {
        this.identificado = !this.identificado;
    }
}
