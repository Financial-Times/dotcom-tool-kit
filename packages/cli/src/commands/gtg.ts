import {Command, flags} from '@oclif/command'
import fetch from 'node-fetch'

function waitForOk (url: string) {
	return new Promise(function (resolve, reject) {
		let timeout: number;
		let checker: number;
		function checkGtg () {
			console.log(`⏳ polling: ${url}`);
			fetch(url, { timeout: 2000, follow: 0 })
				.then(function (response) {
					if (response.ok) {
						console.log(`✅ ${url} ok!`);
						clearTimeout(timeout);
						clearInterval(checker);
						resolve();
					} else {
						console.log(`❌ ${url} not ok`);
					}
				})
				.catch(error => {
					if (error.type && error.type === 'request-timeout') {
						console.log(`👋 Hey, ${url} doesn't seem to be responding yet, so there's that. You're amazing, by the way. I don't say that often enough. But you really are.`); // eslint-disable-line no-console
					}
					else {
						reject(`😿 ${url} Error: ${error}`);
						clearInterval(checker);
					}
				});
		}
		checker = setInterval(checkGtg, 3000);
		timeout = setTimeout(function () {
			reject(`😢 ${url} did not respond with an ok response within two minutes.`);
			clearInterval(checker);
		}, 2*60*1000);
	});

};

function getURL (appName: string) {
	let host = appName || 'http://local.ft.com:3002';

	if (!/:|\./.test(host)) host += '.herokuapp.com/__gtg';

	if (!/https?\:\/\//.test(host)) host = 'http://' + host;

	return host;
}

export default class GoodToGo extends Command {
  static flags = {
	app: flags.string({
		char: 'a', description: 'Runs gtg (\'good to go\') checks for an app', required: true
	})
  }

  async run () {
  	const { flags } = this.parse(GoodToGo)

  	const { app } = flags;

  	const url = getURL(app);

  	return waitForOk(url);
  }
}
