const menu = document.createElement("dialog");
menu.setAttribute("id", "menuReservas");
menu.innerHTML = `
    <label for="numero-mesa">Número de mesa</label>
    <br />
    <select name="numero-mesa">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
    </select>
    <br />
    <br />
    <label for="numero-comensales">Número de comensales</label>
    <br />
    <select name="numero-comensales">
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="6">6</option>
        <option value="8">8</option>
        <option value="10">10</option>
    </select>
    <br />
    <br />
    <button id="reservar">Reservar</button>
    <button id="cancelar">Cancelar</button>
`;
document.body.appendChild(menu);
const menu_button = document.getElementById("menu-button");
menu_button.addEventListener("click", (e) => {
	e.stopPropagation();
	menu.style.left = `${e.clientX}px`;
	menu.style.top = `${e.clientY}px`;
	menu.close();
	menu.inert = true; // Para quitar el autofocus
	menu.showModal();
	menu.inert = false; // Para quitar el autofocus
});

const btnReservar = document.getElementById("reservar");
btnReservar.addEventListener("click", () => {
	reservarMesa();
	menu.close();
});

const btnCancelar = document.getElementById("cancelar");
btnCancelar.addEventListener("click", () => {
	menu.close();
});

function reservarMesa() {
	const mesa = document.createElement("svg");
	mesa.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	mesa.setAttribute("viewBox", "0 0 300 300");
	mesa.setAttribute("width", "300");
	mesa.setAttribute("height", "300");
	mesa.setAttribute("class", "mesa");
	mesa.innerHTML = `
        <rect x="110" y="110" width="80" height="80" rx="8" ry="8"
                fill="#8B5E3C" stroke="#6a4226" stroke-width="2"/>

        <rect class="silla" x="125" y="40" width="50" height="40" rx="6" ry="6"/>
        <rect class="silla" x="125" y="220" width="50" height="40" rx="6" ry="6"/>
        <rect class="silla" x="40" y="125" width="40" height="50" rx="6" ry="6"/>
        <rect class="silla" x="220" y="125" width="40" height="50" rx="6" ry="6"/>
    `;
	document.body.appendChild(mesa);
}
