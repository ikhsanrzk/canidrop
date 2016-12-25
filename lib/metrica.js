const got = require('got');

const endpoint = 'https://api-metrika.yandex.ru/';

class Metrica {
	constructor({oauth}) {
		this._oauth = oauth;
	}

	_call(path, query = {}) {
		return got(`${endpoint}${path}`, {
			headers: {Authorization: `OAuth ${this._oauth}`},
			json: true,
			query
		}).then(response => response.body);
	}

	getCounters() {
		return this._call('management/v1/counters').then(body => body.counters);
	}

	getReport(counterId) {
		return this._call('stat/v1/data', {
			ids: counterId,
			// metrics: 'ym:s:visits',
			// dimensions: 'ym:s:browser,ym:s:browserAndVersion',
			date1: '7daysAgo',
			date2: 'today',
			preset: 'tech_browsers',
			limit: 100000
		});
	}
}

module.exports = Metrica;
