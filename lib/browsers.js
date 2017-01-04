const {groupBy, mapValues} = require('lodash');

const stripRedundantVersions = versions => {
	const hasMinor = versions.some(x => x.version.minor);

	return versions.filter(x => !(hasMinor && x.version.minor === 0));
};

exports.group = (records, threshold) => {
	const relevant = records.filter(records => {
		const {percent} = records.metrics.visits;

		return percent >= threshold;
	});
	const browsers = groupBy(relevant, 'browser');

	return mapValues(browsers, stripRedundantVersions);
};
