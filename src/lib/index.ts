export type JSON = { [x: PropertyKey]: JSON } | JSON[] | string | number | boolean;

function is_primitive(x: JSON): x is string | number | boolean {
	if (['string', 'number', 'boolean'].includes(typeof x)) return true;
	return false;
}

function not_defined(x: unknown): x is undefined {
	if (x === undefined || x === null) return true;
	if (Number.isNaN(x)) return true;
	return false;
}

/**
 * 
 * @param obj {JSON} A POJO style object or Array to get the value from
 * @param path {string | string[]} A string path to the value you want to get
 * @returns {JSON | undefined} The value at the path, or undefined if not found
 */
export function get (obj:JSON, path:string | string[]) {
	// return on undesirable input
	if (obj === undefined) return obj;
	if (obj === null) return undefined;
	if (Number.isNaN(obj)) return undefined;

	// function is finalized, return the value
	if (path.length === 0) return obj;

	// split the path if it's not already an array
	if (typeof path === 'string') {
		path = path.split('.').reverse();
	}

	// get next path segment
	const current = path.pop();

	// if name is also empty, bail
	if (current === undefined) return obj;

	// if we still have paths to process, but we have a primitive value, bail
	if (path.length > 0 && is_primitive(obj)) return undefined;

	// if we have a primitive, return it
	if (is_primitive(obj)) return obj;

	// recurse and handle arrays
	if (Array.isArray(obj)) return get(obj[parseInt(current)], path);
	// recurse objects
	if (obj[current]) return get(obj[current], path);

	// for all other cases return undefined
	return undefined;
};

/**
 *
 * @param obj {JSON} A POJO style object or Array to get the value from
 * @param path {string | string[]} A string path to the value you want to get
 * The path is a string with dot notation, e.g. 'a.b.c.d.e',
 * can also be an array of strings, e.g. ['a', 'b', 'c', 'd', 'e']
 * and you you can reference array indexes, e.g. 'a.b.1.2.c.d.3
 *
 * @returns {JSON | undefined} The original object, with modifications if any
 */
export function set(obj: JSON, path: string | string[], value: JSON) {
	// split the path first on '.' to get path segments
	const keys = Array.isArray(path) ? path : path.split('.');
	// lets start with the object reference
	let current = obj;

	keys.forEach((key, index) => {
		// if we are at the end of the path, set the value
		if (index === keys.length - 1) {
			// return on undesirable input
			if (is_primitive(current)) return current;
			if (not_defined(current)) return current;

			// set the value at the end of the path, object is finalized
			if (Array.isArray(current)) {
				current[parseInt(key)] = value;
			} else {
				current[key] = value;
			}
		} else {
			// if we are not at the end of the path, create the path if it doesn't exist
			// but first return on undesirable input
			if (is_primitive(current)) return current;
			// if we are currently on an array, run the same code as for objects, but with an integer key
			if (Array.isArray(current)) {
				const s = parseInt(key);
				// if the next key is an integer, then we set an array, otherwise an object
				current[s] = current[s] || (isNaN(parseInt(keys[index + 1])) ? {} : []);
				// shift the object pointer
				current = current[s];
			} else {
				// if the next key is an integer, then we set an array, otherwise an object
				current[key] = current[key] || (isNaN(parseInt(keys[index + 1])) ? {} : []);
				// shift the object pointer
				current = current[key];
			}
		}
	});
	// all paths are processed. return the original object
	// this functions modifies the object in place
	return obj;
}
