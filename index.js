const {oauth} = require('./config');
const Metrica = require('./lib/metrica');
const {parse} = require('./lib/report');
const {extractBrowsers, extractVersions, extractOutput} = require('./lib/reducers');

const metrica = new Metrica({oauth});

const site = process.argv[2];
const threshold = process.argv[3];

metrica.getCounters()
	.then(xs => xs.find(x => x.site === site).id)
	.then(id => metrica.getReport(id))
	.then(report => {
		const browsers = parse(report);
		const relevantBrowsers = browsers.filter(({metrics}) => metrics.visits.percent >= threshold);

		const _browsers = extractBrowsers(relevantBrowsers);
		const versions = extractVersions(_browsers);
		const output = extractOutput(versions, threshold);

		output.forEach(line => console.log(line));
	})
	.catch(err => console.log(err));
