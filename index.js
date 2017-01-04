const {oauth} = require('./config');
const Metrica = require('./lib/metrica');
const {parse} = require('./lib/report');
const {group} = require('./lib/browsers');
const {format} = require('./lib/io');

const metrica = new Metrica({oauth});

const site = process.argv[2];
const threshold = process.argv[3];

metrica.getCounters()
	.then(xs => xs.find(x => x.site === site).id)
	.then(id => metrica.getReport(id))
	.then(report => {
		const records = parse(report);
		const browsers = group(records, threshold);
		const lines = format(browsers, threshold);

		lines.forEach(line => console.log(line));
	})
	.catch(err => console.log(err));
