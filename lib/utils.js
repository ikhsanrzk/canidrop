exports.zipObj = function (a, b) {
	const obj = {};
	const len = Math.min(a.length, b.length);

	for (let i = 0; i < len; i += 1) {
		obj[a[i]] = b[i];
	}

	return obj;
};
