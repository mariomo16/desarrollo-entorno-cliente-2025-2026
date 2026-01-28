import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class PeticionesService {
	public url: URL;

	constructor(public _httpd: HttpClient) {
		this.url = new URL("https://randomuser.me/api");
	}

	getUser(): Observable<any> {
		return this._httpd.get(this.url.toString());
	}
}
