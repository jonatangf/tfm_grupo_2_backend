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
const keysToCamel = (obj) => {
	if (obj === null || obj === undefined || typeof obj !== "object") {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(keysToCamel);
	}

	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		const camelKey = snakeToCamel(key);
		result[camelKey] = typeof value === "object" ? keysToCamel(value) : value;
	}
	return result;
};

/**
 * Convierte las claves de un objeto de camelCase a snake_case
 * @param {Object} obj - Objeto con claves en camelCase
 * @returns {Object} Objeto con claves en snake_case
 */
const keysToSnake = (obj) => {
	if (obj === null || obj === undefined || typeof obj !== "object") {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(keysToSnake);
	}

	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		const snakeKey = camelToSnake(key);
		result[snakeKey] = typeof value === "object" ? keysToSnake(value) : value;
	}
	return result;
};

module.exports = {
	snakeToCamel,
	camelToSnake,
	keysToCamel,
	keysToSnake
};