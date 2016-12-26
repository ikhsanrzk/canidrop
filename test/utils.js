import test from 'ava';

import {zipObj} from '../lib/utils';

test('zipObj with equal lengths', t => {
	const actual = zipObj(['a', 'b'], [1, 2]);
	const expected = {a: 1, b: 2};

	t.deepEqual(actual, expected);
});

test('zipObj with less keys', t => {
	const actual = zipObj(['a'], [1, 2]);
	const expected = {a: 1};

	t.deepEqual(actual, expected);
});

test('zipObj with less values', t => {
	const actual = zipObj(['a', 'b'], [1]);
	const expected = {a: 1};

	t.deepEqual(actual, expected);
});

test('zipObj with empty arrays', t => {
	const actual = zipObj([], []);
	const expected = {};

	t.deepEqual(actual, expected);
});
