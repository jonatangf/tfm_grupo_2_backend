/**
 * Convierte una cadena de snake_case a camelCase
 * @param {string} str - Cadena en snake_case
 * @returns {string} Cadena en camelCase
 */
const snakeToCamel = (str) => {
	return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

/**
 * Convierte una cadena de camelCase a snake_case
 * @param {string} str - Cadena en camelCase
 * @returns {string} Cadena en snake_case
 */
const camelToSnake = (str) => {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Convierte las claves de un objeto de snake_case a camelCase
 * @param {Object} obj - Objeto con claves en snake_case
 * @returns {Object} Objeto con claves en camelCase
 */
// Helper: determina si un valor es un "plain object" (objeto literal)
// Razón: la conversión de claves debe recorrer únicamente objetos literales
// y arrays. Objetos no-lisos como `Date`, `Buffer` o instancias de clases
// custom no deben ser recursivamente transformados porque eso puede
// corromper su valor (por ejemplo, `Date` se convertiría en un objeto vacío).
// Por eso comprobamos el tipo exacto con Object.prototype.toString.
const isPlainObject = (v) => Object.prototype.toString.call(v) === "[object Object]";

// Convierte las claves de un objeto de snake_case a camelCase.
// Comportamiento clave:
// - Si `obj` es `null` o `undefined`, se devuelve tal cual.
// - Si es un array, se mapea recursivamente sus elementos.
// - Si no es un objeto literal (por ejemplo, Date, Buffer, instancia de clase),
//   se devuelve sin modificar para preservar su semántica.
// - Solo se recorre recursivamente cuando el valor es un objeto literal o
//   un array, evitando así perder/transformar valores complejos.
const keysToCamel = (obj) => {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(keysToCamel);
	}

	if (!isPlainObject(obj)) {
		return obj;
	}

	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		const camelKey = snakeToCamel(key);
		result[camelKey] = isPlainObject(value) || Array.isArray(value) ? keysToCamel(value) : value;
	}
	return result;
};

/**
 * Convierte las claves de un objeto de camelCase a snake_case
 * @param {Object} obj - Objeto con claves en camelCase
 * @returns {Object} Objeto con claves en snake_case
 */
// Convierte las claves de un objeto de camelCase a snake_case.
// La lógica es simétrica a `keysToCamel` y aplica las mismas reglas:
// - Arrays se mapean recursivamente.
// - Solo se recorren objetos literales para evitar modificar valores
//   no-lisos (Date, Buffer, etc.).
const keysToSnake = (obj) => {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(keysToSnake);
	}

	if (!isPlainObject(obj)) {
		return obj;
	}

	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		const snakeKey = camelToSnake(key);
		result[snakeKey] = isPlainObject(value) || Array.isArray(value) ? keysToSnake(value) : value;
	}
	return result;
};

module.exports = {
	snakeToCamel,
	camelToSnake,
	keysToCamel,
	keysToSnake
};