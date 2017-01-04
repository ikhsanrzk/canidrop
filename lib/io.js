exports.extractOutput = (_versions, threshold) => {
	const chalk = require('chalk');

	return Object.keys(_versions).map(browser => {
		const versions = _versions[browser];

		return `${browser} ` + versions.map(({version, metrics}) => {
			const visits = metrics.visits.percent;
			const rate = (visits * 100).toFixed(2);
			const color = visits > threshold * 2 ? chalk.red : chalk.yellow;
			const {minor, major} = version;
			const v = color(`${major}.${minor}`);

			return `${v} ${chalk.dim(rate + '%')}`;
		}).join(', ');
	}).sort();
};
