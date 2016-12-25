const R = require('ramda');
const chalk = require('chalk');
const config = require('./config');
const Metrica = require('./lib/metrica');

const {oauth} = config;
const metrica = new Metrica({oauth});

const site = process.argv[2];
const threshold = process.argv[3];

metrica.getCounters()
	.then(xs => xs.find(x => x.site === site).id)
	.then(id => metrica.getReport(id))
	.then(normalizeReport)
	.then(report => {
		const browsers = report.reduce((acc, record) => {
			const {browser, version, visits} = record;
			const [major, minor] = version.split('.');

			acc[browser] = acc[browser] || {};
			acc[browser][major] = acc[browser][major] || {};
			acc[browser][major][minor || ''] = visits;

			return acc;
		}, {});

		Object.keys(browsers).forEach(browser => {
			const majors = browsers[browser];
			const versions = [];

			Object.keys(majors).forEach(major => {
				const minors = majors[major];

				if (Object.keys(minors).length === 1 && '' in minors) {
					versions.push({version: major, visits: minors['']});
				} else {
					Object.keys(minors).filter(x => x !== '').forEach(minor => {
						versions.push({version: `${major}.${minor}`, visits: minors[minor]});
					});
				}
			});

			browsers[browser] = versions;
		});

		const output = Object.keys(browsers).map(browser => {
			const versions = browsers[browser];

			return `${browser} ` + versions.map(({version, visits}) => {
				const rate = (visits * 100).toFixed(2);
				const color = visits > threshold * 2 ? chalk.red : chalk.yellow;

				return `${color(version)} ${chalk.dim(rate + '%')}`;
			}).join(', ');
		}).sort();

		output.forEach(line => console.log(line));
	})
	.catch(err => {
		console.log(err.response.body);
	});

function normalizeReport(report) {
	const visits = R.zipObj(report.query.metrics, report.totals)['ym:s:visits'];

	const records = report.data.map(record => ({
		segments: R.zipObj(report.query.dimensions, record.dimensions),
		visits: R.zipObj(report.query.metrics, record.metrics)['ym:s:visits']
	}));

	const browsers = records.map(version => ({
		browser: version.segments['ym:s:browser'].name,
		version: (
			version.segments['ym:s:browserAndVersion'].id ||
			version.segments['ym:s:browserAndVersionMajor'].id
		).split('.').slice(1).join('.'),
		visits: version.visits / visits
	}));

	const relevantBrowsers = browsers.filter(version => {
		return version.visits >= threshold;
	});

	return relevantBrowsers;
}
