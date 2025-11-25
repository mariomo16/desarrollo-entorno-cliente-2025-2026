//Definimos e iniciamos las variables necesarias
let y = 0;
let x = 0;
let controlY = 1;
let controlX = 1;
const velocidad = 1;

const intervalo = setInterval(mover, 5);

function mover() {
	if (controlX === 1) {
		x += velocidad;
	} else {
		x -= velocidad;
	}
	if (x <= 0) {
		controlX = 1;
		x = 0;
	} else if (x >= document.getElementById("lienzo").offsetWidth - 150) {
		controlX = 0;
		x = document.getElementById("lienzo").offsetWidth - 150;
	}

	if (controlY === 1) {
		y += velocidad;
	} else {
		y -= velocidad;
	}
	if (y <= 0) {
		controlY = 1;
		y = 0;
	} else if (y >= document.getElementById("lienzo").offsetHeight - 150) {
		controlY = 0;
		y = document.getElementById("lienzo").offsetHeight - 150;
	}

	document.getElementById("imagen").style.left = `${x}px`;
	document.getElementById("imagen").style.top = `${y}px`;
}
