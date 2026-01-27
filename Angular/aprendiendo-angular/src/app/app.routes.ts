import { Routes } from "@angular/router";
import { Home } from "./components/home/home";
import { NotFound } from "./components/not-found/not-found";
import { Videojuegos } from "./components/videojuegos/videojuegos";
import { Zapatillas } from "./components/zapatillas/zapatillas";

export const routes: Routes = [
	{  
		path: "",
		pathMatch: "full",
        redirectTo: "home",
	},
	{
		path: "home",
		component: Home,
	},
	{
		path: "videojuegos",
		component: Videojuegos,
	},
	{
		path: "zapatillas",
		component: Zapatillas,
	},
	{
		path: "**",
		component: NotFound,
	},
];
