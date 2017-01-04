const got = require('got');

const endpoint = 'https://api-metrika.yandex.ru/';

class Metrica {
	constructor({oauthProvider}) {
		this._oauthProvider = oauthProvider;
	}

	_call(path, query = {}) {
		return this._oauthProvider.getToken()
			.then(oauth => {
				return got(`${endpoint}${path}`, {
					headers: {Authorization: `OAuth ${oauth}`},
					json: true,
					query
				});
			})
			.then(response => response.body)
			.catch(err => {
				console.error(err);

				this._oauthProvider.clearToken();

				return this._call(path, query);
			});
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
