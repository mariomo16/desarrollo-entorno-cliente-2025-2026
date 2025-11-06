/**
 * @file script.js
 * @description Sistema CRUD para la gestión completa de usuarios con validación en tiempo real
 * @author Mario Morales Ortega
 * @version beta
 * @see {@link https://github.com/mariomo16/desarrollo-entorno-cliente-2025-2026/blob/main/Gesti%C3%B3n%20de%20usuarios}
 */

/**
 * Expresión regular para validar DNI español o NIE
 * Formato: [XYZ]?[0-7][0-9]{6,7}[LETRA]
 * @type {RegExp}
 * @constant
 */
const DNI_PATTERN = /^[XYZ]?\d{7,8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;

/**
 * Expresión regular para validar nombres y apellidos
 * Permite letras (incluidos caracteres acentuados) y espacios entre palabras
 * @type {RegExp}
 * @constant
 */
const NAME_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+(\s[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)*$/;

/**
 * Expresión regular para validar fechas en formato ISO (YYYY-MM-DD)
 * @type {RegExp}
 * @constant
 */
const BIRTHDATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

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

/**
 * Color CSS por defecto para bordes de inputs
 * @type {string}
 * @constant
 */
const BORDER_COLOR_DEFAULT = "#e2e5ea";

/**
 * Tipo de diálogo para mensajes de éxito
 * @type {string}
 * @constant
 */
const DIALOG_TYPE_SUCCESS = "success";

/**
 * Tipo de diálogo para mensajes de error
 * @type {string}
 * @constant
 */
const DIALOG_TYPE_ERROR = "error";

/**
 * @typedef {Object} User
 * @property {string} dni - DNI o NIE del usuario en formato mayúsculas
 * @property {string} firstName - Nombre del usuario
 * @property {string} lastName - Apellidos del usuario
 * @property {string} birthDate - Fecha de nacimiento en formato DD/MM/YYYY
 */

/**
 * Array que almacena todos los usuarios del sistema
 * @type {User[]}
 */
const users = [
	{
		dni: "24470848K",
		firstName: "Mario",
		lastName: "Morales Ortega",
		birthDate: "03/10/2002",
	},
];

/**
 * Panel principal donde se renderiza el contenido
 * @type {HTMLElement}
 */
const mainContent = document.getElementById("main-content");

/**
 * Input para buscar usuarios por DNI
 * @type {HTMLInputElement}
 */
const dniSearchInput = document.getElementById("search");

/**
 * Dialog modal para mostrar mensajes al usuario
 * @type {HTMLDialogElement}
 */
const infoDialog = document.createElement("dialog");

/**
 * Normaliza un DNI/NIE convirtiéndolo a mayúsculas
 * @param {string} input - DNI a normalizar
 * @returns {string} DNI normalizado en mayúsculas
 */
function normalizeDNI(inputValue) {
	return inputValue.toUpperCase();
}

/**
 * Convierte una fecha de formato ISO (YYYY-MM-DD) a formato español (DD/MM/YYYY)
 * @param {string} isoDate - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {string} Fecha en formato DD/MM/YYYY
 */
function formatISODateToDDMMYYYY(isoDate) {
	const [year, month, day] = isoDate.split("-");
	return `${day}/${month}/${year}`;
}

/**
 * Busca un usuario por su DNI en el array de usuarios
 * @param {string} dni - DNI normalizado a buscar
 * @returns {User|undefined} Usuario encontrado o undefined si no existe
 */
function findUserByDNI(dni) {
	return users.find((user) => user.dni === dni);
}

// -----------------------------------------------------------------------------------------------

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Indica si la validación fue exitosa
 * @property {string[]} errors - Array de mensajes de error
 * @property {Object} data - Datos validados (si isValid es true)
 */

/**
 * Valida un campo usando una expresión regular
 * @param {string} value - Valor a validar
 * @param {RegExp} pattern - Expresión regular para validar
 * @returns {boolean} true si el valor cumple con el patrón, false en caso contrario
 */
function validateField(value, pattern) {
	return pattern.test(value);
}

/**
 * Verifica si todos los campos requeridos de un formulario están completos
 * @returns {boolean} true si todos los campos requeridos tienen valor
 */
function isFormComplete() {
	const requiredInputs = Array.from(
		document.getElementsByClassName("required"),
	);
	for (const input of requiredInputs) {
		if (input.value.trim() === "") {
			return false;
		}
	}
	return true;
}

/**
 * Comprueba si un DNI ya existe en el sistema
 * @param {string} dni - DNI a verificar (sin normalizar)
 * @returns {boolean} true si el DNI existe, false en caso contrario
 */
function isDNIDuplicated(dni) {
	const normalizedDNI = normalizeDNI(dni);
	const user = findUserByDNI(normalizedDNI);
	return user !== undefined;
}

/**
 * Valida todos los campos del formulario de creación de usuario
 * @returns {ValidationResult} Objeto con resultado de validación y datos
 */
function validateCreationFormData() {
	const dniInput = document.getElementById("dni");
	const firstNameInput = document.getElementById("firstName");
	const lastNameInput = document.getElementById("lastName");
	const birthDateInput = document.getElementById("birthDate");

	const dniValue = dniInput.value.trim();
	const firstNameValue = firstNameInput.value.trim();
	const lastNameValue = lastNameInput.value.trim();
	const birthDateValue = birthDateInput.value;

	const errors = [];

	if (!validateField(dniValue, DNI_PATTERN)) {
		errors.push("El formato del DNI/NIE no es válido");
	}

	if (validateField(dniValue, DNI_PATTERN) && isDNIDuplicated(dniValue)) {
		errors.push("El DNI/NIE ya está registrado");
	}

	if (!validateField(firstNameValue, NAME_PATTERN)) {
		errors.push("El nombre contiene caracteres no válidos");
	}

	if (!validateField(lastNameValue, NAME_PATTERN)) {
		errors.push("Los apellidos contienen caracteres no válidos");
	}

	if (!validateField(birthDateValue, BIRTHDATE_PATTERN)) {
		errors.push("La fecha de nacimiento no es válida");
	}

	return {
		isValid: errors.length === 0,
		errors: errors,
		data: {
			dni: dniValue,
			firstName: firstNameValue,
			lastName: lastNameValue,
			birthDate: birthDateValue,
		},
	};
}

/**
 * Valida los campos editables del formulario de edición
 * @returns {ValidationResult} Objeto con resultado de validación y datos
 */
function validateEditFormData() {
	const editableElements = document.getElementsByClassName("editable");
	const firstNameElement = editableElements[0];
	const lastNameElement = editableElements[1];

	const firstNameValue = firstNameElement.textContent.trim();
	const lastNameValue = lastNameElement.textContent.trim();

	const errors = [];

	if (!validateField(firstNameValue, NAME_PATTERN)) {
		errors.push("El nombre contiene caracteres no válidos");
	}

	if (!validateField(lastNameValue, NAME_PATTERN)) {
		errors.push("Los apellidos contienen caracteres no válidos");
	}

	return {
		isValid: errors.length === 0,
		errors: errors,
		data: {
			firstName: firstNameValue,
			lastName: lastNameValue,
		},
	};
}

// CRUD

/**
 * Crea un nuevo usuario y lo añade al array de usuarios
 * @param {Object} userData - Datos del usuario a crear (ya validados)
 * @param {string} userData.dni - DNI/NIE del usuario
 * @param {string} userData.firstName - Nombre del usuario
 * @param {string} userData.lastName - Apellidos del usuario
 * @param {string} userData.birthDate - Fecha de nacimiento (DD/MM/YYYY)
 * @returns {User} Usuario creado
 */
function createUser(userData) {
	const newUser = {
		dni: userData.dni,
		firstName: userData.firstName,
		lastName: userData.lastName,
		birthDate: userData.birthDate,
	};
	users.push(newUser);
	return newUser;
}

/**
 * Obtiene un usuario por su DNI
 * @param {string} dni - DNI del usuario a buscar
 * @returns {User|undefined} Usuario encontrado o undefined
 */
function getUser(dni) {
	return findUserByDNI(dni);
}

/**
 * Obtiene todos los usuarios del sistema
 * @returns {User[]} Array con todos los usuarios
 */
function getAllUsers() {
	return users;
}

/**
 * Actualiza los datos de un usuario existente
 * @param {string} dni - DNI del usuario a actualizar
 * @param {Object} newData - Nuevos datos del usuario
 * @param {string} [newData.firstName] - Nuevo nombre (opcional)
 * @param {string} [newData.lastName] - Nuevos apellidos (opcional)
 * @returns {boolean} true si se actualizó correctamente, false si no se encontró el usuario
 */
function updateUser(dni, newData) {
	const user = findUserByDNI(dni);
	if (user === undefined) {
		return false;
	}
	if (newData.firstName !== undefined) {
		user.firstName = newData.firstName;
	}
	if (newData.lastName !== undefined) {
		user.lastName = newData.lastName;
	}
	return true;
}

/**
 * Elimina un usuario del sistema
 * @param {string} dni - DNI del usuario a eliminar
 * @returns {boolean} true si se eliminó correctamente, false si no se encontró
 */
function deleteUser(dni) {
	const userIndex = users.findIndex((user) => user.dni === dni);

	if (userIndex === -1) {
		return false;
	}
	users.splice(userIndex, 1);
	return true;
}

// UI

/**
 * Aplica estilos de validación (color) a un elemento según su validez
 * @param {HTMLElement} element - Elemento al que aplicar el estilo
 * @param {boolean} isValid - Indica si el elemento es válido
 * @returns {void}
 */
function applyValidationStyle(element, isValid) {
	if (isValid) {
		element.classList.add("invalid");
	} else element.classList.add("invalid");
}

/**
 * Resetea el estilo del input de búsqueda de DNI
 * @returns {void}
 */
function resetDNIInputStyle() {
	document.getElementById("search").style.borderColor = BORDER_COLOR_DEFAULT;
}

/**
 * Aplica estilo de error al input de búsqueda de DNI
 * @returns {void}
 */
function applyDNIInputErrorStyle() {
	document.getElementById("search").style.borderColor = INVALID_COLOR;
}

// DOM

/**
 * Genera el HTML para mostrar la información de un usuario
 * @param {User} user - Usuario del que generar el HTML
 * @returns {string} HTML del usuario
 */
function generateUserHTML(user) {
	return `
        <div class="user-info">
            <p>DNI / NIE: <strong>${user.dni}</strong></p>
            <p>Nombre: <strong>${user.firstName}</strong></p>
            <p>Apellidos: <strong>${user.lastName}</strong></p>
            <p>Fecha de nacimiento: <strong>${user.birthDate}</strong></p>
        </div>
    `;
}

/**
 * Genera el HTML del formulario de creación de usuarios
 * @returns {string} HTML del formulario
 */
function generateCreationForm() {
	return `
        <form id="creation-form">
            <label for="dni">DNI / NIE</label>
            <input id="dni" class="required" type="text" name="dni" autocomplete="off" required />
           
            <label for="firstName">Nombre</label>
            <input id="firstName" class="required" type="text" name="firstName" autocomplete="given-name" required />
             
            <label for="lastName">Apellidos</label>
            <input id="lastName" class="required" type="text" name="lastName" autocomplete="family-name" required />
        
            <label for="birthDate">Fecha de nacimiento</label>
            <input id="birthDate" class="required" type="date" name="birthDate" autocomplete="bday" required />
        
            <button id="createUserBtn" type="button">Crear usuario</button>
    </form>
    `;
}

/**
 * Genera el HTML del formulario de edición con los datos del usuario
 * @param {User} user - Usuario cuyos datos se van a editar
 * @returns {string} HTML del formulario de edición
 */
function generateEditForm(user) {
	return `
        <div class="user-info">
            <p>DNI / NIE: <strong>${user.dni}</strong></p>
            <p>Nombre: <strong class="editable" contenteditable>${user.firstName}</strong><span>Editando</span></p>
            <p>Apellidos: <strong class="editable" contenteditable>${user.lastName}</strong><span>Editando</span></p>
            <p>Fecha de nacimiento: <strong>${user.birthDate}</strong></p>
            <button type="button" id="updateUserBtn">Actualizar usuario</button>
        </div>
     `;
}

/**
 * Genera el HTML interno del diálogo modal
 * @param {string} message - Mensaje a mostrar (puede contener HTML)
 * @param {string} type - Tipo de diálogo (success, error, info)
 * @returns {string} HTML del contenido del diálogo
 */
function generateDialogHTML(message, type) {
	return `
        <div class="dialog-${type}">
            ${message}
            <span>Pulse ESC para cerrar</span>
        </div>
    `;
}

// DOM RENDER

/**
 * Renderiza un usuario en el contenedor especificado
 * @param {User} user - Usuario a renderizar
 * @param {HTMLElement} container - Contenedor donde renderizar
 * @returns {void}
 */
function renderUser(user, container) {
	const userDiv = document.createElement("div");
	userDiv.innerHTML = generateUserHTML(user);
	container.appendChild(userDiv.firstElementChild);
}

/**
 * Renderiza una lista de usuarios en el contenedor
 * @param {User[]} users - Array de usuarios a renderizar
 * @param {HTMLElement} container - Contenedor donde renderizar
 * @returns {void}
 */
function renderUserList(users, container) {
	const fragment = document.createDocumentFragment();

	users.forEach((user) => {
		const userDiv = document.createElement("div");
		userDiv.innerHTML = generateUserHTML(user);
		fragment.appendChild(userDiv.firstElementChild);
	});
	container.appendChild(fragment);
}

// DIALOG

/**
 * Muestra un diálogo modal con un mensaje
 * @param {string} message - Mensaje a mostrar (puede contener HTML)
 * @param {string} type - Tipo de diálogo (success, error, info)
 * @returns {void}
 */
function showDialog(message, type) {
	infoDialog.innerHTML = generateDialogHTML(message, type);
	document.body.appendChild(infoDialog);
	infoDialog.close();
	infoDialog.showModal();
}

/**
 * Cierra el diálogo modal
 * @returns {void}
 */
function closeDialog() {
	infoDialog.close();
}

// UI MANAGEMENT

/**
 * Limpia el panel principal eliminando formularios y datos mostrados
 * Resetea los estilos del input de búsqueda
 * @returns {void}
 */
function clearPanel() {
	resetDNIInputStyle();

	const form = document.getElementsByTagName("form")[0];
	if (form !== undefined) {
		form.remove();
		return;
	}

	const userInfoElements = Array.from(
		document.getElementsByClassName("user-info"),
	);
	for (const element of userInfoElements) {
		element.remove();
	}
}

// EVENT LISTENERS

/**
 * Configura los event listeners del formulario de creación
 * Añade validación en tiempo real y listener al botón de crear
 * @returns {void}
 * @example
 * setupCreationFormListeners()
 */
function setupCreationFormListeners() {
	const dniInput = document.getElementById("dni");
	const firstNameInput = document.getElementById("firstName");
	const lastNameInput = document.getElementById("lastName");
	const birthDateInput = document.getElementById("birthDate");
	const createUserbtn = document.getElementById("createUserBtn");

	const inputValidationMap = new Map([
		[dniInput, DNI_PATTERN],
		[firstNameInput, NAME_PATTERN],
		[lastNameInput, NAME_PATTERN],
		[birthDateInput, BIRTHDATE_PATTERN],
	]);

	for (const [inputElement, pattern] of inputValidationMap) {
		inputElement.addEventListener("input", () => {
			const isValid = validateField(inputElement.value, pattern);
			applyValidationStyle(inputElement, isValid);
		});
	}

	createUserbtn.addEventListener("click", handleCreateUser);
}

/**
 * Configura los event listeners del formulario de edición
 * Añade validación en tiempo real y listener al botón de actualizar
 * @returns {void}
 */
function setupEditFormListeners() {
	const editableElements = document.getElementsByClassName("editable");
	const updateUserBtn = document.getElementById("updateUserBtn");

	for (const element of editableElements) {
		element.addEventListener("input", () => {
			const isValid = validateField(element.textContent, NAME_PATTERN);
			applyValidationStyle(element, isValid);
		});
	}

	updateUserBtn.addEventListener("click", handleUpdateUser);
}

/**
 * Elimina los event listeners de un formulario
 * Previene memory leaks al cambiar de vista
 * @returns {void}
 */
function removeFormEventListeners() {
	const form = document.getElementsByTagName("form")[0];
	if (form !== undefined) {
		const newForm = form.cloneNode(true);
		form.parentNode.replaceChild(newForm, form);
	}
}

// HANDLER FUNCTIONS

/**
 * Maneja la lectura y visualización de un usuario específico por DNI
 * Valida el input, busca el usuario y lo renderiza
 * @returns {void}
 */
function handleReadUser() {
	const inputValue = dniSearchInput.value.trim();

	if (inputValue === "") {
		applyDNIInputErrorStyle();
		return;
	}

	if (!validateField(inputValue, DNI_PATTERN)) {
		applyDNIInputErrorStyle();
		return;
	}

	const normalizedDNI = normalizeDNI(inputValue);
	const user = getUser(normalizedDNI);

	if (user === undefined) {
		showDialog(
			`
            <p id="notfound">No se ha encontrado ningún usuario.</br> 
            DNI/NIE introducido: <strong>${normalizedDNI}</strong></p>
        `,
			DIALOG_TYPE_ERROR,
		);
		return;
	}

	clearPanel();
	renderUser(user, mainContent);
	dniSearchInput.value = "";
	dniSearchInput.focus();
}

/**
 * Maneja la lectura y visualización de todos los usuarios
 * @returns {void}
 */
function handleReadAllUsers() {
	clearPanel();
	const allUsers = getAllUsers();
	renderUserList(allUsers, mainContent);
	dniSearchInput.focus();
}

/**
 * Maneja la visualización del formulario de creación de usuarios
 * Limpia el panel, renderiza el formulario y configura los listeners
 * @returns {void}
 */
function handleShowCreationForm() {
	clearPanel();
	const formHTML = generateCreationForm();
	mainContent.innerHTML = formHTML;
	setupCreationFormListeners();
	document.getElementById("dni").focus();
}

/**
 * Maneja la creación de un nuevo usuario
 * Valida los datos, crea el usuario y muestra confirmación
 * @returns {void}
 */
function handleCreateUser() {
	const validation = validateCreationFormData();

	if (!validation.isValid) {
		// Mostrar errores visuales
		const dniInput = document.getElementById("dni");
		const firstNameInput = document.getElementById("firstName");
		const lastNameInput = document.getElementById("lastName");
		const birthDateInput = document.getElementById("birthDate");

		applyValidationStyle(
			dniInput,
			validateField(validation.data.dni, DNI_PATTERN) &&
				!isDNIDuplicated(validation.data.dni),
		);
		applyValidationStyle(
			firstNameInput,
			validateField(validation.data.firstName, NAME_PATTERN),
		);
		applyValidationStyle(
			lastNameInput,
			validateField(validation.data.lastName, NAME_PATTERN),
		);
		applyValidationStyle(
			birthDateInput,
			validateField(validation.data.birthDate, BIRTHDATE_PATTERN),
		);
		return;
	}

	const normalizedDNI = normalizeDNI(validation.data.dni);
	const formattedBirthdate = formatISODateToDDMMYYYY(validation.data.birthDate);

	const newUser = createUser({
		dni: normalizedDNI,
		firstName: validation.data.firstName,
		lastName: validation.data.lastName,
		birthDate: formattedBirthdate,
	});

	clearPanel();
	showDialog(
		`
        <p id="created">Usuario creado con éxito.</br> 
        DNI/NIE creado: <strong>${newUser.dni}</strong></p>
    `,
		DIALOG_TYPE_SUCCESS,
	);
}

/**
 * Maneja la visualización del formulario de edición de un usuario
 * Busca el usuario, limpia el panel y muestra el formulario de edición
 * @returns {void}
 */
function handleShowEditForm() {
	const inputValue = dniSearchInput.value.trim();

	if (inputValue === "") {
		applyDNIInputErrorStyle();
		return;
	}

	if (!validateField(inputValue, DNI_PATTERN)) {
		applyDNIInputErrorStyle();
		return;
	}
	const normalizedDNI = normalizeDNI(inputValue);
	const user = getUser(normalizedDNI);

	if (user === undefined) {
		showDialog(
			`
            <p id="notfound">No se ha encontrado ningún usuario.</br> 
            DNI/NIE introducido: <strong>${normalizedDNI}</strong></p>
        `,
			DIALOG_TYPE_ERROR,
		);
		return;
	}

	clearPanel();
	const formHTML = generateEditForm(user);
	mainContent.innerHTML = formHTML;
	setupEditFormListeners();
	dniSearchInput.value = "";
}

/**
 * Maneja la actualización de los datos de un usuario
 * Valida los campos editados y actualiza el usuario si son válidos
 * @returns {void}
 */
function handleUpdateUser() {
	const strongElements = document.getElementsByTagName("strong");

	if (strongElements.length === 0) {
		// Error: no hay elementos strong en la página
		showDialog(
			"<p>Error: No se pudo obtener la información del usuario</p>",
			DIALOG_TYPE_ERROR,
		);
		return;
	}

	const dniValue = strongElements[0].textContent;

	const validation = validateEditFormData();

	if (!validation.isValid) {
		// Aplicar estilos de error a los campos inválidos
		const editableElements = document.getElementsByClassName("editable");
		const firstNameElement = editableElements[0];
		const lastNameElement = editableElements[1];

		const isFirstNameValid = validateField(
			validation.data.firstName,
			NAME_PATTERN,
		);
		const isLastNameValid = validateField(
			validation.data.lastName,
			NAME_PATTERN,
		);

		applyValidationStyle(firstNameElement, isFirstNameValid);
		applyValidationStyle(lastNameElement, isLastNameValid);

		// Cambiar border de los párrafos contenedores
		firstNameElement.closest("p").style.borderColor = isFirstNameValid
			? "var(--accent)"
			: INVALID_COLOR;
		lastNameElement.closest("p").style.borderColor = isLastNameValid
			? "var(--accent)"
			: INVALID_COLOR;

		return;
	}

	const success = updateUser(dniValue, validation.data);

	if (success) {
		const user = getUser(dniValue);
		clearPanel();
		showDialog(
			`
            <h3>Usuario actualizado</h3>
            <p>DNI / NIE: <strong>${user.dni}</strong></p>
            <p>Nombre: <strong>${user.firstName}</strong></p>
            <p>Apellidos: <strong>${user.lastName}</strong></p>
            <p>Fecha de nacimiento: <strong>${user.birthDate}</strong></p>
        `,
			DIALOG_TYPE_SUCCESS,
		);
	}
}

/**
 * Maneja la eliminación de un usuario del sistema
 * Valida el DNI, confirma existencia, elimina y muestra confirmación
 * @returns {void}
 */
function handleDeleteUser() {
	const inputValue = dniSearchInput.value.trim();

	if (inputValue === "") {
		applyDNIInputErrorStyle();
		return;
	}

	if (!validateField(inputValue, DNI_PATTERN)) {
		applyDNIInputErrorStyle();
		return;
	}

	const normalizedDNI = normalizeDNI(inputValue);
	const user = getUser(normalizedDNI);

	if (user === undefined) {
		showDialog(
			`
            <p id="notfound">No se ha encontrado ningún usuario.</br> 
            DNI/NIE introducido: <strong>${normalizedDNI}</strong></p>
        `,
			DIALOG_TYPE_ERROR,
		);
		return;
	}

	const success = deleteUser(normalizedDNI);

	if (success) {
		clearPanel();
		dniSearchInput.value = "";
		showDialog(
			`
            <p id="deleted">Usuario eliminado con éxito.</br> 
            DNI/NIE eliminado: <strong>${normalizedDNI}</strong></p>
        `,
			DIALOG_TYPE_SUCCESS,
		);
	}
}

// INITIALIZATION

/**
 * Inicialización de la aplicación
 * Configura los event listeners del menú principal y carga la vista inicial
 */
window.addEventListener("load", () => {
	// Event listeners del menú principal
	document
		.getElementById("createUser")
		.addEventListener("click", handleShowCreationForm);
	document
		.getElementById("getAllUsers")
		.addEventListener("click", handleReadAllUsers);
	document.getElementById("getUser").addEventListener("click", handleReadUser);
	document
		.getElementById("updateUser")
		.addEventListener("click", handleShowEditForm);
	document
		.getElementById("deleteUser")
		.addEventListener("click", handleDeleteUser);

	// Mostrar todos los usuarios al cargar la página
	handleReadAllUsers();
});
