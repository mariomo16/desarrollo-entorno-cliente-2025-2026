/**
 * @file script.js
 * @description Sistema CRUD para la gestión completa de usuarios con validación en tiempo real
 * @author Mario Morales Ortega
 * @version 1.2.0
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
const regexDniNie = /^[XYZ]?\d{7,8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;

/**
 * Expresión regular para validar nombres y apellidos
 * Permite letras (incluidos caracteres acentuados) y espacios entre palabras
 * @type {RegExp}
 * @constant
 */
const regexNameSurname =
	/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;

/**
 * Expresión regular para validar fechas en formato ISO (YYYY-MM-DD)
 * @type {RegExp}
 * @constant
 */
const regexBirthdate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

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
		panel.appendChild(showUser);
		document.getElementById("readDNI").focus();
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
	panel.appendChild(showUser);
	// Limpiar el input
	document.getElementById("readDNI").value = "";
	document.getElementById("readDNI").focus();
}

// ==================== FUNCIONES DE CREACIÓN ====================

/**
 * Valida los datos del formulario y crea un nuevo usuario
 * Comprueba que todos los campos cumplan con las expresiones regulares
 * y que el DNI/NIE no esté duplicado
 * @returns {void}
 */
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
		regexBirthdate.test(clientBirthdate) === true &&
		user === undefined
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

/**
 * Crea un nuevo usuario y lo añade al array de usuarios
 * Muestra un mensaje de confirmación mediante un dialog modal
 * @param {string} dni - DNI o NIE del usuario
 * @param {string} name - Nombre del usuario
 * @param {string} surname - Apellidos del usuario
 * @param {string} birthdate - Fecha de nacimiento en formato DD/MM/YYYY
 * @returns {void}
 */
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

/**
 * Genera y muestra el formulario HTML para crear nuevos usuarios
 * Configura los event listeners necesarios para la validación en tiempo real
 * @returns {void}
 */
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
	const panel = document.getElementsByTagName("main")[0];

	// Variable para leer el valor introducido
	const input = document.getElementById("readDNI").value;
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
	panel.appendChild(showUser);
	// Añadir event listener al botón de actualización
	document
		.getElementsByTagName("button")[0]
		.addEventListener("click", updateUser);

	// Limpiar el input
	document.getElementById("readDNI").value = "";
}

/**
 * Actualiza los datos modificados de un usuario
 * Valida nombre y apellidos antes de guardar los cambios
 * Muestra feedback visual en caso de datos inválidos
 * @returns {void}
 */
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

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Valida el DNI/NIE introducido en el input de búsqueda
 * Comprueba formato correcto y existencia del usuario en el sistema
 * @returns {boolean} true si la validación es correcta, false en caso contrario
 */
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

/**
 * Limpia el panel principal eliminando formularios y datos de usuarios mostrados
 * Restablece el estilo del input de búsqueda
 * @returns {void}
 */
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

	document.getElementById("readDNI").style.borderColor = "#e2e5ea";
}
