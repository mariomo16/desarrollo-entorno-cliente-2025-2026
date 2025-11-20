/**
 * @description Sistema CRUD para la gestión completa de usuarios con validación en tiempo real
 * @author Mario Morales Ortega
 * @see {@link https://github.com/mariomo16/desarrollo-entorno-cliente-2025-2026/blob/main/Gesti%C3%B3n%20de%20usuarios}
 * - searchUser() https://github.com/mariomo16/desarrollo-entorno-cliente-2023-2024/blob/main/U.T.%206./CRUD%20de%20clientes/crudClientesV2.js#L107
 * - orderBySurname() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#sorting_array_of_objects
 * - updateUsers() https://stackoverflow.com/questions/76379507/how-to-update-json-file-in-database-using-fetch
 */

// URL de la API
const url = "http://localhost:3000/usuarios";

// Array que almacena todos los usuarios de forma local
let users;

// Obtiene todos los usuarios y los asigna a la variable users
async function getUsers() {
	users = await fetchUsers();
}

// Añade el usuario (objeto) pasado por parametro a users.json
function createUser(user) {
	fetch(url, {
		method: "POST",
		body: JSON.stringify(user),
		headers: {
			"Content-Type": "application/json",
		},
	});
}

// Lee y devuelve todos los usuarios del archivo users.json
async function fetchUsers() {
	return fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
		},
	}).then((response) => response.json());
}

// Actualiza el usuario (objeto) pasado por parametro en users.json
async function updateUsers(user) {
	await fetch(`${url}/${user.id}`, {
		method: "PUT",
		body: JSON.stringify(user),
		headers: {
			"Content-Type": "application/json",
		},
	});
}

// Elimina el usuario por id del archivo users.json
async function deleteFromUsers(id) {
	await fetch(`${url}/${id}`, {
		method: "DELETE",
		body: JSON.stringify(id),
		headers: {
			"Content-Type": "application/json",
		},
	});
}

const dniPattern = /^[XYZ]?\d{7,8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;
const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const VALID_COLOR = "var(--text)";
const INVALID_COLOR = "#ef5350";

// ==================== INICIALIZACIÓN DE EVENTOS ====================

// Event listeners para las opciones del menú principal
document.getElementById("readUsers").addEventListener("click", readUsers);
document.getElementById("createUser").addEventListener("click", createForm);
document.getElementById("readUser").addEventListener("click", readUser);
document.getElementById("updateUser").addEventListener("click", modifyUser);
document.getElementById("deleteUser").addEventListener("click", deleteUser);

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		readUsers();
	}
	if (event.key === "Enter") {
		readUser();
	}
});

// Elemento dialog para mostrar notificaciones al usuario
const info = document.createElement("dialog");

readUsers();

// ==================== FUNCIONES DE LECTURA ====================

// Muestra todos los usuarios almacenados en el sistema ordenados alfabéticamente por apellidos
async function readUsers() {
	await getUsers();
	sortBySurname();
	if (document.getElementById("search").style.borderColor !== "#e2e5ea") {
		document.getElementById("search").style.borderColor = "#e2e5ea";
	}
	if (document.getElementsByClassName("user-info").length < users.length) {
		clear();
		const mainContent = document.getElementById("main-content");
		users.forEach((user) => {
			const userData = document.createElement("div");
			userData.classList.add("user-info");
			userData.innerHTML += `
                <p>DNI / NIE: <strong>${user.dni}</strong></p>
                <p>Nombre: <strong>${user.name}</strong></p>
                <p>Apellidos: <strong>${user.surname}</strong></p>
                <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
            `;
			mainContent.appendChild(userData);
		});
	}
	document.getElementById("search").focus();
}

// Muestra un usuario o usuarios específicos por su DNI/NIE o apellidos
function readUser() {
	const input = document.getElementById("search").value;
	const inputResult = checkInput(input);
	if (inputResult === undefined) {
		return;
	}
	const user = searchUser(input);
	if (inputResult === false || user === undefined) {
		notifications(undefined, input);
		return;
	}
	clear();

	const usersArray = Array.isArray(user) ? user : [user];

	const mainContent = document.getElementById("main-content");
	usersArray.forEach((user) => {
		const userData = document.createElement("div");
		userData.classList.add("user-info");
		userData.innerHTML += `
            <p>DNI / NIE: <strong>${user.dni}</strong></p>
            <p>Nombre: <strong>${user.name}</strong></p>
            <p>Apellidos: <strong>${user.surname}</strong></p>
            <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
        `;
		mainContent.appendChild(userData);
	});
	document.getElementById("search").focus();
}

// ==================== FUNCIONES DE CREACIÓN ====================

// Valida los datos del formulario y crea un nuevo usuario
function newUser() {
	const idInput = document.getElementById("dni");
	const nameInput = document.getElementById("name");
	const surnameInput = document.getElementById("surname");
	const birthdateInput = document.getElementById("birthdate");

	const id = idInput.value.toUpperCase();
	const user = searchUser(id);

	if (
		dniPattern.test(id) &&
		namePattern.test(nameInput.value) &&
		namePattern.test(surnameInput.value) &&
		datePattern.test(birthdateInput.value) === true &&
		user === undefined
	) {
		const splittedDate = birthdateInput.value.split("-");
		const birthdate = `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
		// Creo un objeto con los datos recibidos
		const userData = {
			dni: id,
			name: nameInput.value,
			surname: surnameInput.value,
			birthdate: birthdate,
		};
		createUser(userData);
		notifications("create", "", userData);
		info.close();
		info.showModal();
		return;
	}
}

// Genera y muestra el formulario HTML para crear nuevos usuarios
function createForm() {
	if (document.getElementById("search").style.borderColor !== "#e2e5ea") {
		document.getElementById("search").style.borderColor = "#e2e5ea";
	}
	if (!document.getElementById("userForm")) {
		clear();
		const panel = document.getElementById("main-content");
		const userForm = document.createElement("form");
		userForm.setAttribute("id", "userForm");
		userForm.innerHTML = `
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
		panel.appendChild(userForm);
		addEvents();
	}
	document.getElementById("dni").focus();
}

// Añade event listeners al formulario de creación de usuarios
function addEvents() {
	const createUserbtn = document.getElementById("newUser");
	// Mapa con todos los campos del formulario y sus Regex
	const inputValidationMap = new Map([
		[document.getElementById("dni"), dniPattern],
		[document.getElementById("name"), namePattern],
		[document.getElementById("surname"), namePattern],
		[document.getElementById("birthdate"), datePattern],
	]);

	for (const [inputElement, pattern] of inputValidationMap) {
		inputElement.addEventListener("input", () => {
			const isValid = pattern.test(inputElement.value);
			inputElement.style.color = !isValid ? INVALID_COLOR : VALID_COLOR;
		});
	}
	createUserbtn.addEventListener("click", newUser);
}

// ==================== FUNCIONES DE ACTUALIZACIÓN ====================

// Muestra el formulario de edición para un usuario específico
function modifyUser() {
	const input = document.getElementById("search").value;
	if (checkInput(input) === undefined) {
		return;
	}
	const user = searchUser(input);
	if (!dniPattern.test(input) || user === undefined) {
		notifications(undefined, input);
		return;
	}
	clear();

	const panel = document.getElementById("main-content");
	const userPanel = document.createElement("div");
	userPanel.classList.add("user-info");
	userPanel.innerHTML = `
        <p>DNI / NIE: <strong>${user.dni}</strong></p>
        <p>Nombre: <strong class="editable" contenteditable>${user.name}</strong><span>Editando</span></p>
        <p>Apellidos: <strong class="editable" contenteditable>${user.surname}</strong><span>Editando</span></p>
        <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
        <button type="button" id="updateUser">Actualizar usuario</button>
    `;
	panel.appendChild(userPanel);
	document
		.getElementsByTagName("button")[0]
		.addEventListener("click", updateUser);
}

// Si los datos son válidos, actualiza el usuario y muestra notificación de éxito
function updateUser() {
	const dni = document.getElementsByTagName("strong")[0].textContent;
	const user = searchUser(dni);
	const userName = document.getElementsByTagName("strong")[1].textContent;
	const userSurname = document.getElementsByTagName("strong")[2].textContent;

	if (namePattern.test(userName) && namePattern.test(userSurname) === true) {
		clear();
		user.name = userName;
		user.surname = userSurname;
		updateUsers(user);
		notifications("update", "", user);
	} else {
		// Validación visual: cambia el color del borde según la validez del campo
		document.getElementsByTagName("p")[5].style.borderColor = namePattern.test(
			userName,
		)
			? "var(--accent)"
			: INVALID_COLOR;
		document.getElementsByTagName("p")[6].style.borderColor = namePattern.test(
			userSurname,
		)
			? "var(--accent)"
			: INVALID_COLOR;
	}
}

// ==================== FUNCIONES DE ELIMINACIÓN ====================

/**
 * Elimina un usuario del sistema por su DNI/NIE
 * Valida el input antes de proceder con la eliminación
 * Busca el índice del usuario en el array y lo elimina con splice
 * Muestra notificación de confirmación tras la eliminación
 * @returns {void}
 */
function deleteUser() {
	const input = document.getElementById("search").value;
	if (checkInput(input) === undefined) {
		return;
	}
	const user = searchUser(input);
	if (!dniPattern.test(input) || user === undefined) {
		notifications(undefined, input);
		return;
	}
	deleteFromUsers(user.id);
	notifications("delete", input, user);
}

// ==================== FUNCIONES AUXILIARES ====================

// Valida el contenido del input de búsqueda y cambia el color del borde según el estado de validación
function checkInput(input) {
	if (input === "") {
		document.getElementById("search").style.borderColor = INVALID_COLOR;
		document.getElementById("search").focus();
		return undefined;
	}
	if (dniPattern.test(input) === true || namePattern.test(input) === true) {
		document.getElementById("search").style.borderColor = "#e2e5ea";
		return true;
	} else {
		document.getElementById("search").style.borderColor = INVALID_COLOR;
		document.getElementById("search").focus();
		return false;
	}
}

// Busca un usuario por DNI/NIE o filtra usuarios por apellidos parciales
function searchUser(input) {
	const user =
		dniPattern.test(input) === true
			? users.find((user) => user.dni === input.toUpperCase())
			: users.filter((user) =>
					user.surname.toLocaleUpperCase().includes(input.toLocaleUpperCase()),
				);
	if (user === undefined || user.length === 0) {
		return undefined;
	} else {
		return user;
	}
}

// Muestra notificaciones modales según el resultado de la operación utilizando un elemento dialog
function notifications(result, input, user) {
	switch (result) {
		case "create":
			info.innerHTML = `
                    <h3>Usuario creado</h3>
                    <p>DNI / NIE: <strong>${user.dni}</strong></p>
                    <p>Nombre: <strong>${user.name}</strong></p>
                    <p>Apellidos: <strong>${user.surname}</strong></p>
                    <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
                    <span>Pulse ESC para cerrar</span>
                `;
			break;
		case "update":
			info.innerHTML = `
                    <h3>Usuario actualizado</h3>
                    <p>DNI / NIE: <strong>${user.dni}</strong></p>
                    <p>Nombre: <strong>${user.name}</strong></p>
                    <p>Apellidos: <strong>${user.surname}</strong></p>
                    <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
                    <span>Pulse ESC para cerrar</span>
                `;
			break;
		case undefined:
			info.innerHTML = `
                <p id="notfound">No se encontraron resultados para: <strong>${input}</strong></p>
                <span>Pulse ESC para cerrar</span>
            `;
			break;

		case "delete":
			info.innerHTML = `
                <p id="deleted">Usuario eliminado con éxito: <strong>${user.dni}</strong></p>
                <span>Pulse ESC para cerrar</span>
            `;
			break;
	}
	clear();
	document.getElementsByTagName("body")[0].appendChild(info);
	info.style.outline = "none";
	info.close();
	info.showModal();
}

// Ordena el array de usuarios alfabéticamente por apellidos
function sortBySurname() {
	users.sort((a, b) => {
		const surnameA = a.surname.toUpperCase();
		const surnameB = b.surname.toUpperCase();
		if (surnameA < surnameB) {
			return -1;
		}
		if (surnameA > surnameB) {
			return 1;
		}

		// Los apellidos son iguales
		return 0;
	});
}

// Limpia el contenedor principal eliminando todos los elementos hijos
// También restablece el valor y el color del borde del input de búsqueda
function clear() {
	const main = document.getElementById("main-content").children;
	const mainLength = main.length;
	if (mainLength !== 0) {
		for (let i = 0; i <= mainLength - 1; i++) {
			main[0].remove();
		}
		return;
	}
	document.getElementById("search").value = "";
	document.getElementById("search").style.borderColor = "#e2e5ea";
}
