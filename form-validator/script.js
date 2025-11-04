/**
 * script.js - Validador de Formularios
 *
 * @description Valida formularios con reglas personalizables
 * @author Mario Morales Ortega
 * @version 0.0.2
 * @created 2025-11-01
 * @modified 2025-11-01
 * @see https://github.com/mariomo16/practice/tree/main/javascript/form-validator
 *
 * Proyecto de práctica
 */

// Elementos del DOM
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const showPassword = document.getElementById("showpassword");
const passwordHint = document.getElementById("passwordhints");
const passInputCheck = document.getElementById("passwordcheck");
const singupButton = document.getElementById("signup");

// Expresiones regulares
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex =
	/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

// Constantes de validación
const VALID_COLOR = "var(--text)";
const INVALID_COLOR = "#ef5350";

// Event Listeners

// Validación del campo email
emailInput.addEventListener("input", () => {
	const isValid = emailRegex.test(emailInput.value);
	emailInput.style.color = isValid ? VALID_COLOR : INVALID_COLOR;
	checkSignup();
});

// Validación del campo contraseña
passInput.addEventListener("input", () => {
	const isValid = passwordRegex.test(passInput.value);
	passInput.style.color = isValid ? VALID_COLOR : INVALID_COLOR;
	passwordHint.style.display = isValid ? "none" : "block";
	passInputCheck.disabled = !isValid;

	// Limpiar campo de confirmación si se modifica la contraseña
	passInputCheck.value = "";
	checkSignup();
});

// Toggle mostrar/ocultar contraseña
showPassword.addEventListener("change", () => {
	const type = showPassword.checked ? "text" : "password";
	passInput.type = type;
	passInputCheck.type = type;
});

// Validación del campo confirmar contraseña
passInputCheck.addEventListener("input", () => {
	const isValid = passInputCheck.value === passInput.value;
	passInputCheck.style.color = isValid ? VALID_COLOR : INVALID_COLOR;
	checkSignup();
});

// Función de validación
function checkSignup() {
	const isValid =
		emailRegex.test(emailInput.value) &&
		passwordRegex.test(passInput.value) &&
		passInputCheck.value === passInput.value;
	singupButton.disabled = !isValid;
}
