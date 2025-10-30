// Variable con el contenido de la tabla para poder cancelar la edición
let backup = document.getElementsByTagName("table")[0].innerHTML;

// Variable con los botones de Guardar/Cancelar
const options = document.getElementsByClassName("options");

// Asigno los eventos a los botones de Guardar/Cancelar
document.getElementById("save").addEventListener("click", () => save());
document.getElementById("cancel").addEventListener("click", () => cancel());

// Variable con todos los <td>
const tds = document.getElementsByTagName("td");

// Variable con todos los botones "Editar"
const buttons = document.getElementsByTagName("input");
// Función para ponerle los eventos a los botones "Editar"
function events() {
	for (let i = 0; i < buttons.length - 2; i++) {
		buttons[i].addEventListener("click", () => {
			const nodes = buttons[i].parentNode.parentNode.children;
            const parent = buttons[i].parentNode.parentNode.lastElementChild;
            const button = parent.lastElementChild;
			edit(nodes, button);
		});
	}
}
events();
/* 
Lo hago así ya que guardo TODO el contenido de la tabla en una variable, que al cancelar la edición se sobrescribirá y se perderán los eventos de los botones "Editar", así que es necesario volver a poner los eventos al canelar
*/

// Función para editar el contenido de los <td> de la linea seleccionada
function edit(nodes, button) {
	for (let i = 0; i < nodes.length - 1; i++) {
		nodes[i].setAttribute("contenteditable", true);
		nodes[i].style.color = "lightblue";
	}
	for (let i = 0; i < options.length; i++) {
		options[i].removeAttribute("disabled");
	}
    button.value = "Editando";
    button.setAttribute("disabled", true)
}

// Función para guardar los cambios realizados
function save() {
	for (let i = 0; i < tds.length; i++) {
		tds[i].removeAttribute("contenteditable");
		tds[i].style.color = "white";
	}
	for (let i = 0; i < options.length; i++) {
		options[i].setAttribute("disabled", true);
	}
    const buttons = document.getElementsByClassName("edit");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].value = "Editar";
        buttons[i].removeAttribute("disabled");
        
    }
	backup = document.getElementsByTagName("table")[0].innerHTML;
}

// Función para cancelar los cambios realizados
function cancel() {
	for (let i = 0; i < tds.length; i++) {
		tds[i].removeAttribute("contenteditable");
	}
	for (let i = 0; i < options.length; i++) {
		options[i].setAttribute("disabled", true);
	}
	document.getElementsByTagName("table")[0].innerHTML = backup;
	events();
}
