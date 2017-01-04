#!/usr/bin/env node
const meow = require('meow');
const Metrica = require('./lib/metrica');
const oauthProvider = require('./lib/oauth');
const {parse} = require('./lib/report');
const {group} = require('./lib/browsers');
const {format} = require('./lib/io');

const cli = meow(`
    Usage
      $ canidrop <website> [<threshold> = 0.01]

    Options
      <website>    address of a website with Yandex.Metrica
                   counters on it

      <threshold>  percent of visiters below this threshold
                   can be considered negligible

    Example
      $ canidrop example.com 0.02

      Firefox 50 3.41%
      Google Chrome 55 15.28%, 36 1.96%, 35 1.31%, 49 1.29%
      Яндекс.Браузер 16.11 10.61%
`);

const [website, threshold = 0.01] = cli.input;

const metrica = new Metrica({oauthProvider});

metrica.getCounters()
	.then(counters => {
		const counter = counters.find(x => x.site === website);

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
