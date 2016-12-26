const {oauth} = require('./config');
const Metrica = require('./lib/metrica');
const {normalizeReport, extractBrowsers, extractVersions, extractOutput} = require('./lib/reducers');

const metrica = new Metrica({oauth});

const site = process.argv[2];
const threshold = process.argv[3];

metrica.getCounters()
	.then(xs => xs.find(x => x.site === site).id)
	.then(id => metrica.getReport(id))
	.then(report => {
		const normalized = normalizeReport(report, threshold);
		const browsers = extractBrowsers(normalized);
		const versions = extractVersions(browsers);
		const output = extractOutput(versions, threshold);

		output.forEach(line => console.log(line));
	})
	.catch(err => {
		console.log(err);
	});
