/**
 * @file script.js
 * @description Sistema CRUD para la gestión completa de usuarios con validación en tiempo real
 * @author Mario Morales Ortega
 * @version 1.3.0
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
 * Array que almacena todos los usuarios del sistema
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
 * Expresión regular para validar DNI español o NIE
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
 * Color CSS para campos inválidos (rojo)
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
 * Elemento dialog para mostrar mensajes modales al usuario
 * @type {HTMLDialogElement}
 */
const info = document.createElement("dialog");

// Mostrar todos los usuarios al cargar la página
readUsers();

// ==================== FUNCIONES DE LECTURA ====================

/**
 * Muestra todos los usuarios almacenados en el sistema
 * Limpia la pantalla y renderiza cada usuario en un div independiente
 * @returns {void}
 */
function readUsers() {
	limpiarPantalla();
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
		document.getElementById("search").focus();
	});
}

/**
 * Busca y muestra un usuario específico por su DNI/NIE
 * Valida la entrada antes de realizar la búsqueda
 * @returns {void}
 */
function readUser() {
	if (checkInput() === false) {
		return;
	}
	limpiarPantalla();
	const mainContent = document.getElementById("main-content");

	const input = document.getElementById("search").value;
	const user =
		dniPattern.test(input) === true
			? users.find((user) => user.dni === input.toUpperCase())
			: users.find(
					(user) => user.name.toLocaleUpperCase() === input.toLocaleUpperCase(),
				);
	const userData = document.createElement("div");
	userData.classList.add("user-info");
	userData.innerHTML = `
        <p>DNI / NIE: <strong>${user.dni}</strong></p>
        <p>Nombre: <strong>${user.name}</strong></p>
        <p>Apellidos: <strong>${user.surname}</strong></p>
        <p>Fecha de nacimiento: <strong>${user.birthdate}</strong></p>
    `;
	mainContent.appendChild(userData);
	// Limpiar el input
	document.getElementById("search").value = "";
	document.getElementById("search").focus();
}

// ==================== FUNCIONES DE CREACIÓN ====================

/**
 * Valida los datos del formulario y crea un nuevo usuario
 * Comprueba que todos los campos cumplan con las expresiones regulares
 * y que el DNI/NIE no esté duplicado
 * @returns {void}
 */
function newUser() {
	const idInput = document.getElementById("dni").value;
	const nameInput = document.getElementById("name").value;
	const surnameInput = document.getElementById("surname").value;
	const birthdateInput = document.getElementById("birthdate").value;

	const id = idInput.toUpperCase();
	const user = users.find((user) => user.dni === id);

	if (
		dniPattern.test(id) &&
		namePattern.test(nameInput) &&
		namePattern.test(surnameInput) &&
		datePattern.test(birthdateInput) === true &&
		user === undefined
	) {
		const splittedDate = birthdateInput.split("-");
		const birthdate = `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
		// Creo un objeto con los datos recibidos
		const userData = {
			dni: id,
			name: nameInput,
			surname: surnameInput,
			birthdate: birthdate,
		};
		createUser(userData);
		return;
	}
	document.getElementsByTagName("label")[0].classList.add("invalid");
	document.getElementById("dni").focus();
}

/**
 * Crea un nuevo usuario y lo añade al array de usuarios
 * Muestra un mensaje de confirmación mediante un dialog modal
 * @param {string} dni - DNI o NIE del usuario
 * @param {string} name - Nombre del usuario
 * @param {string} surname - Apellidos del usuario
 * @param {string} birthdate - Fecha de nacimiento en formato DD/MM/YYYY
 * @returns {void}
 */
function createUser(user) {
	// Meto el objeto al array de usuarios
	users.push(user);
	info.innerHTML = `
        <p id="created">Usuario creado con éxito.</br> DNI/NIE creado: <strong>${user.dni}</strong></p>
        <span>Pulse ESC para cerrar</span>
    `;
	document.getElementsByTagName("body")[0].appendChild(info);
	limpiarPantalla();
	info.close();
	info.showModal();
}

/**
 * Genera y muestra el formulario HTML para crear nuevos usuarios
 * Configura los event listeners necesarios para la validación en tiempo real
 * @returns {void}
 */
function createForm() {
	limpiarPantalla();
	const panel = document.getElementById("main-content");
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
	panel.appendChild(createForm);
	// Les pongo los eventos
	addEvents();
	document.getElementById("dni").focus();
}

/**
 * Añade event listeners al formulario de creación de usuarios
 * Valida cada campo en tiempo real cambiando el color del texto según su validez
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
 * Permite editar nombre y apellidos mediante campos contenteditable
 * @returns {void}
 */
function modifyUser() {
	if (checkInput() === false) {
		return;
	}
	limpiarPantalla();
	const panel = document.getElementById("main-content");

	// Variable para leer el valor introducido y pasarlo a mayúsculas
	const input = document.getElementById("search").value;
	const user =
		dniPattern.test(input) === true
			? users.find((user) => user.dni === input.toUpperCase())
			: users.find(
					(user) => user.name.toLocaleUpperCase() === input.toLocaleUpperCase(),
				);
	// Creo el div donde se mostraran los datos del usuario
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
	// Añadir event listener al botón de actualización
	document
		.getElementsByTagName("button")[0]
		.addEventListener("click", updateUser);

	// Limpiar el input
	document.getElementById("search").value = "";
}

/**
 * Actualiza los datos modificados de un usuario
 * Valida nombre y apellidos antes de guardar los cambios
 * Muestra feedback visual en caso de datos inválidos
 * @returns {void}
 */
function updateUser() {
	const id = document.getElementsByTagName("strong")[0].textContent;
	const user = users.find((user) => user.dni === id);
	const userName = document.getElementsByTagName("strong")[1].textContent;
	const userSurname = document.getElementsByTagName("strong")[2].textContent;

	if (namePattern.test(userName) && namePattern.test(userSurname) === true) {
		limpiarPantalla();
		user.name = userName;
		user.surname = userSurname;
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
 * Valida la entrada y muestra confirmación tras la eliminación
 * @returns {void}
 */
function deleteUser() {
	if (checkInput() === false) {
		return;
	}
	limpiarPantalla();

	const input = document.getElementById("search").value;
	const userForDelete = (user) =>
		(user === dniPattern.test(input)) === true
			? users.find((user) => user.dni === input.toUpperCase())
			: users.find(
					(user) => user.name.toLocaleUpperCase() === input.toLocaleUpperCase(),
				);
	users.splice(users.findIndex(userForDelete), 1);
	document.getElementById("search").value = "";
	info.innerHTML = `
        <p id="deleted">Usuario eliminado con éxito.</br> Usuario eliminado: <strong>${input}</strong></p>
        <span>Pulse ESC para cerrar</span>
    `;
	document.getElementsByTagName("body")[0].appendChild(info);
	limpiarPantalla();
	info.close();
	info.showModal();
}

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Valida el DNI/NIE introducido en el input de búsqueda
 * Comprueba formato correcto y existencia del usuario en el sistema
 * @returns {boolean} true si la validación es correcta, false en caso contrario
 */
function checkInput() {
	const input = document.getElementById("search").value;
	if (
		input === "" ||
		(dniPattern.test(input) !== true && namePattern.test(input) !== true)
	) {
		document.getElementById("search").style.borderColor = INVALID_COLOR;
		return false;
	} else document.getElementById("search").style.borderColor = "#e2e5ea";
	const user =
		dniPattern.test(input) === true
			? users.find((user) => user.dni === input.toUpperCase())
			: users.find(
					(user) => user.name.toLocaleUpperCase() === input.toLocaleUpperCase(),
				);
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

/**
 * Limpia el panel principal eliminando formularios y datos de usuarios mostrados
 * Restablece el estilo del input de búsqueda
 * @returns {void}
 */
function limpiarPantalla() {
	const main = document.getElementById("main-content").children;
	const mainLength = main.length;
	if (mainLength !== 0) {
		for (let i = 0; i <= mainLength - 1; i++) {
			main[0].remove();
		}
		return;
	}
	document.getElementById("search").style.borderColor = "#e2e5ea";
}
