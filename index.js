const Metrica = require('./lib/metrica');
const oauthProvider = require('./lib/oauth');
const {parse} = require('./lib/report');
const {group} = require('./lib/browsers');
const {format} = require('./lib/io');

const site = process.argv[2];
const threshold = process.argv[3];

const metrica = new Metrica({oauthProvider});

metrica.getCounters()
	.then(counters => {
		const counter = counters.find(x => x.site === site);

		if (!counter) {
			throw new Error('Unknown website');
		}

		return metrica.getReport(counter.id);
	})
	.then(report => {
		const records = parse(report);
		const browsers = group(records, threshold);
		const lines = format(browsers, threshold);

		lines.forEach(line => console.log(line));
	})
	.catch(err => console.error(err));
