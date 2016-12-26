import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

Object.assign(sinon.stub, {
	resolvesTo(value) {
		return this.returns(Promise.resolve(value));
	}
});

test('getCounters', async t => {
	const got = sinon.stub();

	got.withArgs(`https://api-metrika.yandex.ru/management/v1/counters`, {
		headers: {Authorization: 'OAuth token'},
		json: true,
		query: {}
	}).resolvesTo({body: {counters: 'boo'}});

	const Metrica = proxyquire('../lib/metrica', {got});
	const metrica = new Metrica({oauth: 'token'});
	const counters = await metrica.getCounters();

	t.is(counters, 'boo');
});

test('getReport', async t => {
	const got = sinon.stub();

	got.withArgs(`https://api-metrika.yandex.ru/stat/v1/data`, {
		headers: {Authorization: 'OAuth token'},
		json: true,
		query: {
			ids: 1,
			date1: '7daysAgo',
			date2: 'today',
			preset: 'tech_browsers',
			limit: 100000
		}
	}).resolvesTo({body: 'boo'});

	const Metrica = proxyquire('../lib/metrica', {got});
	const metrica = new Metrica({oauth: 'token'});
	const report = await metrica.getReport(1);

	t.is(report, 'boo');
});
