const fs = require('fs');

const mergePackages = new Promise((resovle, reject) => {
	fs.readFile('package.json', (err, data) => {
		if (err) reject(err);
		const initPackage = JSON.parse(data);
		fs.readFile('../apps/app/package.json', (err, data) => {
			if (err) reject(err);
			const incomingPackage = JSON.parse(data);
			const newPackage = {
				...initPackage,
				dependencies: {
					...initPackage.dependencies,
					...incomingPackage.dependencies,
				}
			}
			resovle(JSON.stringify(newPackage, null, '\t'));
		});
	});

})

mergePackages.then(result => {
	fs.writeFileSync('package.json', result);
})
