import test from 'ava';

import {format} from '../lib/io';

test('format', t => {
	const actual = format({
		'Google Chrome': [{
			browser: 'Google Chrome',
			version: {major: 2, minor: 3},
			metrics: {
				visits: {absolute: 150, percent: 0.75},
				visitors: {absolute: 150, percent: 0.75}
			}
		}],
		'Яндекс Браузер': [{
			browser: 'Яндекс Браузер',
			version: {major: 4, minor: 0},
			metrics: {
				visits: {absolute: 50, percent: 0.25},
				visitors: {absolute: 50, percent: 0.25}
			}
		}]
	}, 0.25);
	const expected = [
		'Google Chrome 2.3 75.00%',
		'Яндекс Браузер 4 25.00%'
	];

	t.deepEqual(actual, expected);
});
