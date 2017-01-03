import test from 'ava';

import {parse} from '../lib/report';

test('parse', t => {
	const actual = parse({
		query: {
			dimensions: ['browser', 'browserAndVersionMajor', 'browserAndVersion'],
			metrics: ['visits', 'visitors']
		},
		data: [{
			dimensions: [
				{id: '1', name: 'Google Chrome'},
				{id: '1.2', name: 'Google Chrome 2'},
				{id: '1.2.3', name: 'Google Chrome 2.3'}
			],
			metrics: [50, 150]
		}, {
			dimensions: [
				{id: '2', name: 'Яндекс Браузер'},
				{id: '2.4', name: 'Яндекс Браузер 4'},
				{id: null, name: null}
			],
			metrics: [50, 50]
		}],
		totals: [100, 200]
	});
	const expected = [{
		browser: 'Google Chrome',
		version: {major: 2, minor: 3},
		metrics: {
			visits: {absolute: 50, percent: 0.5},
			visitors: {absolute: 150, percent: 0.75}
		}
	}, {
		browser: 'Яндекс Браузер',
		version: {major: 4, minor: 0},
		metrics: {
			visits: {absolute: 50, percent: 0.5},
			visitors: {absolute: 50, percent: 0.25}
		}
	}];

	t.deepEqual(actual, expected);
});
