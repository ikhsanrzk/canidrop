const {zipObject} = require('lodash');

const stripNS = key => key.replace(/^ym:s:/, '');
const toObj = (query, arr) => zipObject(query.map(stripNS), arr);

const getVersion = dimensions => {
	const {browserAndVersion, browserAndVersionMajor} = dimensions;
	const version = browserAndVersion.id || browserAndVersionMajor.id;
	let [, major, minor] = version.split('.');

	major = Number(major);
	minor = Number(minor) || 0;

	return {major, minor};
};

const getMetrics = (metrics, totals) => {
	return Object.keys(metrics).reduce((acc, key) => {
		acc[key] = {
			absolute: metrics[key],
			percent: metrics[key] / totals[key]
		};

		return acc;
	}, {});
};

exports.parse = report => {
	const {query} = report;
	const totals = toObj(query.metrics, report.totals);

	return report.data.map(row => {
		const dimensions = toObj(query.dimensions, row.dimensions);
		const metrics = toObj(query.metrics, row.metrics);

		return {
			browser: dimensions.browser.name,
			version: getVersion(dimensions),
			metrics: getMetrics(metrics, totals)
		};
	});
};
