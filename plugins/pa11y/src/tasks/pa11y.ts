import { Task } from '@dotcom-tool-kit/types';
const pa11y = require('pa11y');
const { readState } = require('@dotcom-tool-kit/state');

export default class Pa11y extends Task {
   static description = ''

   async run(): Promise<void> {
      const reviewState = readState('review');
		// if we've built a review app, test against that, not the app in the config
		// if (reviewState) {
		// 	this.options.host = `https://${reviewState.appName}.herokuapp.com`;
		// }
		const results = await pa11y(this.options.host, {
			headers: {
				Cookie: 'next-flags=newslettersRedesign%3Aon'
			}
		});
		this.logger.info(`pa11y results: ${results}`);
   }
}