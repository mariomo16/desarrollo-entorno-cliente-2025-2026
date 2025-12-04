const menu_button = document.getElementById("menu-button");
const menu = document.createElement("dialog");
menu.innerHTML = `
    <label for="numero-mesa">Número de mesa</label>
    <br />
    <select name="numero-mesa">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
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
menu_button.addEventListener("click", (e) => {
	e.stopPropagation();
	menu.close();
	menu.inert = true; // Para quitar el autofocus
	menu.showModal();
	menu.inert = false; // Para quitar el autofocus
});

const btnReservar = document.getElementById("reservar");
btnReservar.addEventListener("click", () => {
	menu.close();
	reservarMesa();
});

const btnCancelar = document.getElementById("cancelar");
btnCancelar.addEventListener("click", () => {
	menu.close();
});

function reservarMesa() {
	console.log("Zzzzz");
}
