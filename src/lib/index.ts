export type JSON = string | number | boolean | { [x: string]: JSON } | Array<JSON>;
export function is_primitive(x: JSON): x is string | number | boolean {
	if (['string', 'number', 'boolean'].includes(typeof x)) return true;
	return false;
}

/**
 * 
 * @param obj {JSON} A POJO style object or Array to get the value from
 * @param path {string | string[]} A string path to the value you want to get 
 * The path is a string with dot notation, e.g. 'a.b.c.d.e',
 * can also be an array of strings, e.g. ['a', 'b', 'c', 'd', 'e']
 * and you you can reference array indexes, e.g. 'a.b.1.2.c.d.3
 * 
 * @returns {JSON | undefined} The value at the path or undefined if it doesn't exist
 */
export function get(obj: JSON, path: string | string[]) {
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
	return undefined
}

export function set(obj: JSON, path: string | string[], value: unknown): JSON {
	if (typeof path === 'string') {
		path = path.split('.');
	}

	if (path.length === 1) {
		(obj as { [key: string]: unknown })[path[0]] = value;
		return obj;
	}

	const key = path[0];
	const nextKey = path[1];

	if (!isNaN(Number(nextKey))) {
		if (!Array.isArray(obj[key])) {
			obj[key] = [];
		}
	} else {
		if (!obj[key] || typeof obj[key] !== 'object') {
			obj[key] = {};
		}
	}

	set(obj[key], path.slice(1), value);
	return obj;
}

export const bind = (name: string | undefined) => new Bind(name);
class Bind {
	name: string | undefined = $state();
	value;
	constructor(name: Bind['name'], value?: string | number | boolean | undefined) {
		this.value = value;
		this.name = name;
		this.get = this.get.bind(this);
		this.set = this.set.bind(this);
	}
	get() {
		if (!this.name) return form.state;
		return get(form.state, this.name);
	}
	set(v: unknown) {
		if (!this.name) form.state = v;
		set(form.state, this.name, v);
	}
}
