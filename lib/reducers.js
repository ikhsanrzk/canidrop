exports.extractBrowsers = report => {
	return report.reduce((acc, record) => {
		const {browser, version, metrics} = record;
		const {major, minor} = version;

		acc[browser] = acc[browser] || {};
		acc[browser][major] = acc[browser][major] || {};
		acc[browser][major][minor || ''] = metrics.visits.percent;

		return acc;
	}, {});
};

exports.extractVersions = browsers => {
	const result = {};

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

		result[browser] = versions;
	});

	return result;
};

exports.extractOutput = (_versions, threshold) => {
	const chalk = require('chalk');

	return Object.keys(_versions).map(browser => {
		const versions = _versions[browser];

		return `${browser} ` + versions.map(({version, visits}) => {
			const rate = (visits * 100).toFixed(2);
			const color = visits > threshold * 2 ? chalk.red : chalk.yellow;

			return `${color(version)} ${chalk.dim(rate + '%')}`;
		}).join(', ');
	}).sort();
};
