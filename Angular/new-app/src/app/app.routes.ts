import type { Routes } from "@angular/router";
import { Home } from "./components/home/home";
import { NotFoundComponent } from "./components/not-found-component/not-found-component";
import { VideojuegoComponent } from "./components/videojuego-component/videojuego-component";
import { ZapatillasComponent } from "./components/zapatillas-component/zapatillas-component";

export const routes: Routes = [
	{
		path: "",
		component: Home,
	},
	{
		path: "zapatillas",
		component: ZapatillasComponent,
	},
	{
		path: "videojuego",
		component: VideojuegoComponent,
	},
	{
		path: "**",
		component: NotFoundComponent,
	},
];
