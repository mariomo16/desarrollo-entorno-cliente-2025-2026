/**
 * @file script.js
 * @description CRUD de usuarios - Gestión de usuarios
 * @author Mario Morales Ortega
 * @version 1.1.3
 * @see {https://github.com/mariomo16/desarrollo-entorno-cliente-2025-2026/blob/main/Gesti%C3%B3n%20de%20usuarios}
 */

// Array que contendrá todos los usuarios creados
const users = [];

// Expresiones regulares para comprobar los datos
const regexDniNie = /^[XYZ]?\d{7,8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
const regexNameSurname =
	/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;
const regexBirthdate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// Colores para datos validos e inválidos
const VALID_COLOR = "var(--text)";
const INVALID_COLOR = "#ef5350";

// Eventos para las opciones del menú
document.getElementById("readUsers").addEventListener("click", readUsers);
document.getElementById("createUser").addEventListener("click", createForm);
document.getElementById("readUser").addEventListener("click", readUser);
document.getElementById("updateUser").addEventListener("click", modifyUser);
document.getElementById("deleteUser").addEventListener("click", deleteUser);

const info = document.createElement("dialog");

readUsers();

// Función para mostrar todos los usuarios guardados
function readUsers() {
	limpiarPantalla();
	const panel = document.getElementsByTagName("main")[0];
	users.forEach((user) => {
		const showUser = document.createElement("div");
		showUser.classList.add("user-info");
		showUser.innerHTML += `
            <p>DNI / NIE: <strong>${user.dni}</strong></p>
            <p>Nombre: <strong>${user.name}</strong></p>
            <p>Apellidos: <strong>${user.surname}</strong></p>
            <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
        `;
		panel.style.justifyContent = "flex-start";
		panel.appendChild(showUser);
		document.getElementById("readDNI").focus();
	});
}

// Función que comprobara y pasara los datos del nuevo usuario a newUser()
function newUser() {
	const clientDniNie = document.getElementById("dni").value;
	const clientName = document.getElementById("name").value;
	const clientSurname = document.getElementById("surname").value;
	const clientBirthdate = document.getElementById("birthdate").value;

	const dni = clientDniNie.toUpperCase();
	const user = users.find((user) => user.dni === dni);

	if (
		regexDniNie.test(clientDniNie) &&
		regexNameSurname.test(clientName) &&
		regexNameSurname.test(clientSurname) &&
		regexBirthdate.test(clientBirthdate) === true && user === undefined
	) {
		const birthdateArray = clientBirthdate.split("-");
		const clientBirthdateFormat = `${birthdateArray[2]}/${birthdateArray[1]}/${birthdateArray[0]}`;
		createUser(
			clientDniNie.toUpperCase(),
			clientName,
			clientSurname,
			clientBirthdateFormat,
		);
	} else {
        document.getElementsByTagName("label")[0].classList.add("alreadyexists");
        document.getElementById("dni").focus();
        return;
    }
}
// Función que creara los usuarios y los metera al array de usuarios
function createUser(dni, name, surname, birthdate) {
	// Creo un objeto con los datos recibidos
	const user = {
		dni: dni,
		name: name,
		surname: surname,
		birthdate: birthdate,
	};
	// Meto el objeto al array de usuarios
	users.push(user);
	info.innerHTML = `
        <p id="created">Usuario creado con éxito.</br> DNI/NIE creado: <strong>${dni}</strong></p>
        <span>Pulse ESC para cerrar</span>
    `;
	document.getElementsByTagName("body")[0].appendChild(info);
	limpiarPantalla();
	info.close();
	info.showModal();
}

// Función que mostrara los datos de un usuario en pantalla al introducir su DNI
function readUser() {
	if (checkInput() === false) {
		return;
	}
	limpiarPantalla();
	const panel = document.getElementsByTagName("main")[0];

	const input = document.getElementById("readDNI").value;
	const dni = input.toUpperCase();
	const user = users.find((user) => user.dni === dni);
	const showUser = document.createElement("div");
	showUser.classList.add("user-info");
	showUser.innerHTML = `
        <p>DNI / NIE: <strong>${user.dni}</strong></p>
        <p>Nombre: <strong>${user.name}</strong></p>
        <p>Apellidos: <strong>${user.surname}</strong></p>
        <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
    `;
	panel.style.justifyContent = "center";
	panel.appendChild(showUser);
	// Limpiar el input
	document.getElementById("readDNI").value = "";
	document.getElementById("readDNI").focus();
}

// Funcion para modificar los datos de algún usuario
function modifyUser() {
	if (checkInput() === false) {
		return;
	}
	limpiarPantalla();
	const panel = document.getElementsByTagName("main")[0];

	// Variable para leer el valor introducido
	const input = document.getElementById("readDNI").value;
	// Compruebo si se esta mostrando otro usuario actualmente
	// Convierto el valor introducido a mayúsculas
	const dni = input.toUpperCase();
	// Busco algún (object) user dentro de (array) users con el campo DNI igual al introducido
	const user = users.find((user) => user.dni === dni);
	// Creo el div donde se mostraran los datos del usuario
	const showUser = document.createElement("div");
	showUser.classList.add("user-info");
	showUser.innerHTML = `
        <p>DNI / NIE: <strong>${user.dni}</strong></p>
        <p>Nombre: <strong class="editable" contenteditable>${user.name}</strong><span>Editando</span></p>
        <p>Apellidos: <strong class="editable" contenteditable>${user.surname}</strong><span>Editando</span></p>
        <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
        <button type="button" id="updateUser">Actualizar usuario</button>
    `;
	panel.style.justifyContent = "center";
	panel.appendChild(showUser);
	// Si lo buscas por ID dice que va a llamar al evento tu prima
	document
		.getElementsByTagName("button")[0]
		.addEventListener("click", updateUser);

	// Limpiar el input
	document.getElementById("readDNI").value = "";
}
// Función para actualizar los datos modificados de un usuario
function updateUser() {
	const dni = document.getElementsByTagName("strong")[0].textContent;
	const user = users.find((user) => user.dni === dni);
	const clientName = document.getElementsByTagName("strong")[1].textContent;
	const clientSurname = document.getElementsByTagName("strong")[2].textContent;

	if (
		regexNameSurname.test(clientName) &&
		regexNameSurname.test(clientSurname) === true
	) {
		limpiarPantalla();
		user.name = clientName;
		user.surname = clientSurname;
		info.innerHTML = `
            <h3>Usuario actualizado</h3>
            <p>DNI / NIE: <strong>${user.dni}</strong></p>
            <p>Nombre: <strong>${user.name}</strong></p>
            <p>Apellidos: <strong>${user.surname}</strong></p>
            <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
            <span>Pulse ESC para cerrar</span>
        `;
		document.getElementsByTagName("body")[0].appendChild(info);
		info.showModal();
	} else {
		document.getElementsByTagName("p")[5].style.borderColor =
			regexNameSurname.test(clientName) ? "var(--accent)" : INVALID_COLOR;
		document.getElementsByTagName("p")[6].style.borderColor =
			regexNameSurname.test(clientSurname) ? "var(--accent)" : INVALID_COLOR;
	}
}

function deleteUser() {
	if (checkInput() === false) {
		return;
	}
	limpiarPantalla();

	const input = document.getElementById("readDNI").value;
	const dni = input.toUpperCase();
	const userForDelete = (user) =>
		user === users.find((user) => user.dni === dni);
	users.splice(users.findIndex(userForDelete), 1);
	document.getElementById("readDNI").value = "";
	info.innerHTML = `
        <p id="deleted">Usuario eliminado con éxito.</br> DNI/NIE eliminado: <strong>${dni}</strong></p>
        <span>Pulse ESC para cerrar</span>
    `;
	document.getElementsByTagName("body")[0].appendChild(info);
	limpiarPantalla();
	info.close();
	info.showModal();
}

function checkInput() {
	const input = document.getElementById("readDNI").value;
	const dni = input.toUpperCase();
	if (input === "" || regexDniNie.test(input) !== true) {
		document.getElementById("readDNI").style.borderColor = INVALID_COLOR;
		return false;
	} else document.getElementById("readDNI").style.borderColor = "#e2e5ea";
	const user = users.find((user) => user.dni === dni);
	if (user === undefined) {
		info.innerHTML = `
            <p id="notfound">No se ha encontrado ningún usuario.</br> DNI/NIE introducido: <strong>${dni}</strong></p>
            <span>Pulse ESC para cerrar</span>
        `;
		document.getElementsByTagName("body")[0].appendChild(info);
		limpiarPantalla();
		info.close();
		info.showModal();
		return false;
	}
}

// Función para crear el formulario para crear usuarios
function createForm() {
	limpiarPantalla();
	const panel = document.getElementsByTagName("main")[0];
	const createForm = document.createElement("form");
	createForm.innerHTML = `
        <label for="dni">DNI / NIE</label>
        <input type="text" name="dni" id="dni" required />

        <label for="name">Nombre</label>
        <input type="text" name="name" id="name" autocomplete="given-name" required />

        <label for="surname">Apellidos</label>
        <input type="text" name="surname" id="surname" autocomplete="family-name" required />

        <label for="birthdate">Fecha de nacimiento</label>
        <input type="date" name="birthdate" id="birthdate" required />

        <button type="button" id="newUser">
            Crear usuario
        </button>
    `;
	panel.style.justifyContent = "center";
	panel.appendChild(createForm);
	// Les pongo los eventos
	addEvents();
	document.getElementById("dni").focus();
}

// Función para poner los eventos al formulario de creación de usuarios
function addEvents() {
	// Constantes con todos los campos del formulario
	const clientDniNie = document.getElementById("dni");
	const clientName = document.getElementById("name");
	const clientSurname = document.getElementById("surname");
	const clientBirthdate = document.getElementById("birthdate");
	const buttonCreateUser = document.getElementById("newUser");

	clientDniNie.addEventListener("input", () => {
		const isValid = regexDniNie.test(clientDniNie.value);
		clientDniNie.style.color = !isValid ? INVALID_COLOR : VALID_COLOR;
	});
	clientName.addEventListener("input", () => {
		const isValid = regexNameSurname.test(clientName.value);
		clientName.style.color = !isValid ? INVALID_COLOR : VALID_COLOR;
	});
	clientSurname.addEventListener("input", () => {
		const isValid = regexNameSurname.test(clientSurname.value);
		clientSurname.style.color = !isValid ? INVALID_COLOR : VALID_COLOR;
	});
	clientBirthdate.addEventListener("input", () => {
		const isValid = regexBirthdate.test(clientBirthdate.value);
		clientBirthdate.style.color = !isValid ? INVALID_COLOR : VALID_COLOR;
	});
	buttonCreateUser.addEventListener("click", newUser);
}

function limpiarPantalla() {
	// Comprobar si el formulario para crear un usuario esta en pantalla
	if (document.getElementsByTagName("form").length === 1) {
		// En el caso de que lo esté, lo borro del HTML
		document.getElementsByTagName("form")[0].remove();
	}

	const userInfo = document.getElementsByClassName("user-info").length;
	// Comprobar si la información de otro usuario esta en pantalla
	if (userInfo !== 0) {
		// En el caso de que lo esté, lo borro del HTML
		for (let i = 0; i <= userInfo - 1; i++) {
			document.getElementsByClassName("user-info")[0].remove();
		}
	}

    // document.getElementById("readDNI").value = "";
    document.getElementById("readDNI").style.borderColor = "#e2e5ea";
}
