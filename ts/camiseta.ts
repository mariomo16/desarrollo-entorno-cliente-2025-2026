export class Camiseta {
	private color: string;
	private modelo: string;
	private marca: string;
	private talla: string;
	private precio: number;

	constructor() {
		this.color = "";
		this.modelo = "";
		this.marca = "";
		this.talla = "";
		this.precio = 0;
	}
}

const camiseta = new Camiseta();

console.log(camiseta);
