const fs = require('fs');
const {format} = require('url');
const opener = require('opener');
const pify = require('pify');
let prompt = require('prompt');
const got = require('got');

prompt = pify(prompt);

const clientId = '2958b567feb146dba5c8f853bdcb6b88';
const clientSecret = '06ac668ea5cf4a5c86576d430142f89a';

const tokenFile = `${__dirname}/../.oauthtoken`;

const md5 = data => {
	return require('crypto').createHash('md5').update(data).digest('hex');
}

const deviceName = require('os').hostname();
const deviceId = md5(deviceName);

const requestCode = () => {
	const url = format({
		host: 'https://oauth.yandex.ru/authorize',
		query: {
			/* eslint-disable camelcase */
			response_type: 'code',
			client_id: clientId,
			device_id: deviceId,
			device_name: deviceName,
			force_confirm: 'yes'
			/* eslint-enable */
		}
	});

	opener(url);

	console.log(`Open ${url} in browser, copy the code from the page and paste it here.`);

	return prompt.get(['code']).then(result => result.code);
};

const requestToken = code => {
	return got('https://oauth.yandex.ru/token', {
		method: 'POST',
		json: true,
		body: {
			/* eslint-disable camelcase */
			grant_type: 'authorization_code',
			code,
			client_id: clientId,
			client_secret: clientSecret,
			device_id: deviceId,
			device_name: deviceName
			/* eslint-enable */
		}
	}).then(result => result.body.access_token);
};

const saveToken = token => {
	fs.writeFileSync(tokenFile, token);
};

exports.getToken = () => {
	try {
		const buffer = fs.readFileSync(tokenFile);
		const token = String(buffer).trim();

		return Promise.resolve(token);
	} catch (err) {
		return requestCode()
			.then(requestToken)
			.then(token => {
				saveToken(token);

				return token;
			});
	}
};

exports.clearToken = () => {
	fs.unlinkSync(tokenFile);
};
