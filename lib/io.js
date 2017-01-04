const {dim, red, yellow} = require('chalk');

const getVersion = ({minor, major}) => minor === 0 ? major : `${major}.${minor}`;
const getRate = visits => (visits * 100).toFixed(2) + '%';

exports.format = (browsers, threshold) => {
	return Object.keys(browsers).map(browser => {
		const versions = browsers[browser];

		return `${browser} ` + versions.map(({version, metrics}) => {
			const visits = metrics.visits.percent;
			const color = visits > threshold * 2 ? red : yellow;

			const v = getVersion(version);
			const r = getRate(visits);

			return color(v) + ' ' + dim(r);
		}).join(', ');
	}).sort();
};
