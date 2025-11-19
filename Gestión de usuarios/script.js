/**
 * @file script.js
 * @description Sistema CRUD para la gestión completa de usuarios con validación en tiempo real
 * @author Mario Morales Ortega
 * @version 1.3.2
 * @see {@link https://github.com/mariomo16/desarrollo-entorno-cliente-2025-2026/blob/main/Gesti%C3%B3n%20de%20usuarios}
 */

/**
 * @typedef {Object} User
 * @property {string} dni - DNI o NIE del usuario en formato mayúsculas
 * @property {string} name - Nombre del usuario
 * @property {string} surname - Apellidos del usuario
 * @property {string} birthdate - Fecha de nacimiento en formato DD/MM/YYYY
 */

/**
 * Array que almacena todos los usuarios
 * @type {User[]}
 */
const users = [
	{
		dni: "12345678Z",
		name: "Ana",
		surname: "García López",
		birthdate: "15/03/1995",
	},
	{
		dni: "87654321M",
		name: "Luis",
		surname: "Pérez Gómez",
		birthdate: "02/11/1988",
	},
	{
		dni: "11223344A",
		name: "María",
		surname: "Sánchez Ruiz",
		birthdate: "25/07/1992",
	},
	{
		dni: "99887766H",
		name: "Carlos",
		surname: "Fernández Díaz",
		birthdate: "09/01/1985",
	},
	{
		dni: "X1234567T",
		name: "Laura",
		surname: "Martín Ortega",
		birthdate: "30/06/2000",
	},
	{
		dni: "Y7654321K",
		name: "Javier",
		surname: "Romero Navarro",
		birthdate: "12/12/1998",
	},
	{
		dni: "13579246P",
		name: "Elena",
		surname: "Torres Castro",
		birthdate: "05/05/1993",
	},
	{
		dni: "24681357L",
		name: "Sergio",
		surname: "Alonso Molina",
		birthdate: "21/09/1990",
	},
	{
		dni: "Z1029384Q",
		name: "Patricia",
		surname: "Núñez Cabrera",
		birthdate: "17/04/1997",
	},
];

/**
 * Expresión regular para validar DNI o NIE
 * Formato: [XYZ]?[0-7][0-9]{6,7}[LETRA]
 * @type {RegExp}
 * @constant
 */
const dniPattern = /^[XYZ]?\d{7,8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;

/**
 * Expresión regular para validar nombres y apellidos
 * Permite letras (incluidos caracteres acentuados) y espacios entre palabras
 * @type {RegExp}
 * @constant
 */
const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;

/**
 * Expresión regular para validar fechas en formato ISO (YYYY-MM-DD)
 * @type {RegExp}
 * @constant
 */
const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * Color CSS para campos válidos
 * @type {string}
 * @constant
 */
const VALID_COLOR = "var(--text)";

/**
 * Color CSS para campos inválidos
 * @type {string}
 * @constant
 */
const INVALID_COLOR = "#ef5350";

// ==================== INICIALIZACIÓN DE EVENTOS ====================

/**
 * Event listeners para las opciones del menú principal
 */
document.getElementById("readUsers").addEventListener("click", readUsers);
document.getElementById("createUser").addEventListener("click", createForm);
document.getElementById("readUser").addEventListener("click", readUser);
document.getElementById("updateUser").addEventListener("click", modifyUser);
document.getElementById("deleteUser").addEventListener("click", deleteUser);

/**
 * Event listener global para mostrar todos los usuarios con la tecla Escape
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent}
 */
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		readUsers();
	}
	if (event.key === "Enter") {
		readUser();
	}
});

/**
 * Elemento dialog para mostrar mensajes modales al usuario
 * @type {HTMLDialogElement}
 */
const info = document.createElement("dialog");

// Mostrar todos los usuarios al cargar la página
readUsers();

// ==================== FUNCIONES DE LECTURA ====================

/**
 * Muestra todos los usuarios almacenados en el sistema
 * Solo renderiza si no están ya mostrados (evita volver a generar)
 * Restablece el color del borde del input de búsqueda si está resaltado
 * @returns {void}
 */
function readUsers() {
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

/**
 * Muestra un usuario o usuarios específicos por su DNI/NIE o nombre
 * Si se introduce un nombre parcial, puede devolver varios resultados
 * Valida el input antes de realizar la búsqueda y muestra notificación si no existe
 * @returns {void}
 */
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

/**
 * Valida los datos del formulario y crea un nuevo usuario
 * Verifica que todos los campos cumplan con las expresiones regulares,
 * que el DNI/NIE no esté duplicado y convierte la fecha de ISO a formato DD/MM/YYYY
 * Muestra notificación de éxito tras la creación
 * @returns {void}
 */
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

/**
 * Añade un nuevo usuario al array de usuarios
 * @param {User} user - Objeto usuario con todos sus datos
 * @returns {void}
 */
function createUser(user) {
	// Meto el objeto al array de usuarios
	users.push(user);
}

/**
 * Genera y muestra el formulario HTML para crear nuevos usuarios
 * Solo crea el formulario si no existe previamente
 * Restablece el color del borde del input de búsqueda si está resaltado
 * Configura los event listeners necesarios para la validación en tiempo real
 * @returns {void}
 */
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
		// Les pongo los eventos
		addEvents();
	}
	document.getElementById("dni").focus();
}

/**
 * Añade event listeners al formulario de creación de usuarios
 * Valida cada campo en tiempo real cambiando el color del texto según su validez
 * Utiliza un Map para asociar cada campo con su expresión regular correspondiente
 * @returns {void}
 */
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

/**
 * Muestra el formulario de edición para un usuario específico
 * Valida el DNI/NIE del input de búsqueda antes de proceder
 * Permite editar nombre y apellidos mediante campos contenteditable
 * Limpia el input de búsqueda tras mostrar el formulario
 * @returns {void}
 */
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

/**
 * Actualiza los datos modificados de un usuario
 * Valida nombre y apellidos antes de guardar los cambios
 * Muestra feedback visual (borde rojo) en caso de datos inválidos
 * Si los datos son válidos, actualiza el usuario y muestra notificación de éxito
 * @returns {void}
 */
function updateUser() {
	const dni = document.getElementsByTagName("strong")[0].textContent;
	const user = searchUser(dni);
	const userName = document.getElementsByTagName("strong")[1].textContent;
	const userSurname = document.getElementsByTagName("strong")[2].textContent;

	if (namePattern.test(userName) && namePattern.test(userSurname) === true) {
		clear();
		user.name = userName;
		user.surname = userSurname;
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
	users.splice(
		users.findIndex((user) => user.dni === input),
		1,
	);
	notifications("delete", input, user);
}

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Valida el contenido del input de búsqueda
 * Cambia el color del borde según el estado de validación
 * @param {string} input - Valor del input a validar
 * @returns {undefined|boolean} undefined si está vacío, true si es válido, false si es inválido
 */
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

/**
 * Busca un usuario por DNI/NIE o filtra usuarios por nombre parcial
 * La búsqueda es case-insensitive
 * @param {string} input - DNI/NIE o nombre a buscar
 * @returns {User|User[]|undefined} Usuario encontrado, array de usuarios si hay coincidencias por nombre, o undefined si no existe
 * @see {@link https://github.com/mariomo16/desarrollo-entorno-cliente-2023-2024/blob/main/U.T.%206./CRUD%20de%20clientes/crudClientesV2.js#L107}
 */
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

/**
 * Muestra notificaciones modales según el resultado de la operación
 * Utiliza un elemento dialog para mostrar información sobre creación,
 * actualización, eliminación o usuario no encontrado
 * @param {string|undefined} result - Tipo de operación: "create", "update", "delete", o undefined para error
 * @param {string} input - Valor de búsqueda (usado en caso de error)
 * @param {User} user - Datos del usuario afectado por la operación
 * @returns {void}
 */
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

/**
 * Limpia el contenedor principal eliminando todos los elementos hijos
 * También restablece el valor y el color del borde del input de búsqueda
 * @returns {void}
 */
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
