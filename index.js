const {oauth} = require('./config');
const Metrica = require('./lib/metrica');
const {parse} = require('./lib/report');
const {group} = require('./lib/browsers');
const {extractOutput} = require('./lib/io');

const metrica = new Metrica({oauth});

const site = process.argv[2];
const threshold = process.argv[3];

metrica.getCounters()
	.then(xs => xs.find(x => x.site === site).id)
	.then(id => metrica.getReport(id))
	.then(report => {
		const records = parse(report);
		const browsers = group(records, threshold);
		const output = extractOutput(browsers, threshold);

		output.forEach(line => console.log(line));
	})
	.catch(err => console.log(err));
