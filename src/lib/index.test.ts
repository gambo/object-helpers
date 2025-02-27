import { describe, test, expect } from 'vitest';
import { get, set } from './index.js';

describe('Get function tests', () => {
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
});
describe('Set function tests', () => {
	test('Set object path', async () => {
		const a = { a: { b: { c: { d: { e: 1 } } } } };
		expect(set(a, 'a.b.c.d.e', 2)).toStrictEqual({ a: { b: { c: { d: { e: 2 } } } } });
	});
	test('Set array path', async () => {
		const a = {};
		expect(set(a, 'a.1.2.3', 2)).toMatchObject({
			a: [undefined, [undefined, undefined, [undefined, undefined, undefined, 2]]]
		});
	});
	test('Start with an array', async () => {
		const a: Array<{ name: string }> = [];
		set(a, '0.name', 'shaun');
		set(a, '1.name', 'john');
		set(a, '2.name', 'paul');
		set(a, '3.name', 'ringo');
		expect(a).toMatchObject([
			{ name: 'shaun' },
			{ name: 'john' },
			{ name: 'paul' },
			{ name: 'ringo' }
		]);
	});

	test('Start with an array', async () => {
		const a: Array<{ name: string }> = [];
		set(a, '0.name', 'shaun');
		set(a, '1.name', 'john');
		set(a, '2.name', 'paul');
		set(a, '3.name', 'ringo');
		expect(a).toMatchObject([
			{ name: 'shaun' },
			{ name: 'john' },
			{ name: 'paul' },
			{ name: 'ringo' }
		]);
	});

	test('Read me examples', () => {
		const a = {};
		expect(set(a, 'a.b.c.d.1.2', 'new value')).toMatchObject({a: {b: {c: {d: [undefined, [undefined, undefined, 'new value']]}}}})
		expect(set([], '0.0.0.0', 'nested arrays')).toMatchObject([[[['nested arrays']]]])
	});
});
