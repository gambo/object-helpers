import { test, expect } from 'vitest';
import { get, set } from './index.js';
import type { JSON } from './index.ts';

test('Get object path', async () => {
	const a = { a: { b: { c: { d: { e: 1 } } } } };
	expect(get(a, 'a.b.c.d.e')).toBe(1);
	const b = { a: { b: ['', { c: { d: { e: ['', '', 1] } } }] } };
	expect(get(b, 'a.b.1.c.d.e.2')).toBe(1);
});

test('Get from Array', async () => {
	const a = [1, 2, 3, { a: { b: [4, 5, 6, { c: { d: 7 } }] } }, 8, 9];
	expect(get(a, '3.a.b.3.c.d')).toBe(7);
	const b = [[[[[[['qwe']]]]]]];
	expect(get(b, '0.0.0.0.0.0.0')).toBe('qwe');
});

test('Get from undefineds and other undesirables', async () => {
	expect(get([], '3.a.b.3.c.d')).toBe(undefined);
	expect(get({}, '0.0.0.0.0.0.0')).toBe(undefined);
	// @ts-expect-error testing bad inputs
	expect(get(undefined, '0.0.0.0.0.0.0')).toBe(undefined);
	// @ts-expect-error testing bad inputs
	expect(get(null, '0.0.0.0.0.0.0')).toBe(undefined);
	expect(get(NaN, 'a.b.c.d.e')).toBe(undefined);
	expect(get(123, 'a.b.c.d.e')).toBe(undefined);
	expect(get('qwe', 'a.b.c.d.e')).toBe(undefined);
	expect(get(true, 'a.b.c.d.e')).toBe(undefined);
	expect(get(0, 'a.b.c.d.e')).toBe(undefined);
	expect(get(1, 'a.b.c.d.e')).toBe(undefined);
});

test('Set object path', async () => {
	const a = { a: { b: { c: { d: { e: 1 } } } } };
	expect(set(a, 'a.b.c.d.e', 2)).toStrictEqual({ a: { b: { c: { d: { e: 2 } } } } });
	const b = { a: { b: { c: { d: { e: 1 } } } } };
	expect(set(b, 'a.b.z.d.e', 2)).toStrictEqual({
		a: { b: { c: { d: { e: 1 } }, z: { d: { e: 2 } } } }
	});
});

test('Set Array path', async () => {
	const a = { a: { b: { c: { d: { e: 1 } } } } };
	set(a, 'a.b.c.1.z.x', 2);
	expect(a).toMatchObject({
		a: {
			b: {
				c: [
					undefined,
					{
						z: {
							x: 2
						}
					}
				]
			}
		}
	});
	const b: JSON = [];
	set(b, '0.0.0.0.0.0', 2);
	expect(b).toMatchObject([[[[[[2]]]]]]);
});

test('undefined and other undesirables', () => {
	expect(set([], '3.a.b.3.c.d', 1)).toMatchObject([
		undefined,
		undefined,
		undefined,
		{ a: { b: [undefined, undefined, undefined, { c: { d: 1 } }] } }
	]);
});
