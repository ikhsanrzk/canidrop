import test from 'ava';

import {group} from '../lib/browsers';

test('group', t => {
	const actual = group([{
		browser: 'Google Chrome',
		version: {major: 2, minor: 0},
		metrics: {
			visits: {absolute: 50, percent: 0.5},
			visitors: {absolute: 150, percent: 0.75}
		}
	}, {
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
	}, {
		browser: 'Яндекс Браузер',
		version: {major: 5, minor: 0},
		metrics: {
			visits: {absolute: 0, percent: 0},
			visitors: {absolute: 0, percent: 0}
		}
	}], 0.01);
	const expected = {
		'Google Chrome': [{
			browser: 'Google Chrome',
			version: {major: 2, minor: 3},
			metrics: {
				visits: {absolute: 50, percent: 0.5},
				visitors: {absolute: 150, percent: 0.75}
			}
		}],
		'Яндекс Браузер': [{
			browser: 'Яндекс Браузер',
			version: {major: 4, minor: 0},
			metrics: {
				visits: {absolute: 50, percent: 0.5},
				visitors: {absolute: 50, percent: 0.25}
			}
		}]
	};

	t.deepEqual(actual, expected);
});
