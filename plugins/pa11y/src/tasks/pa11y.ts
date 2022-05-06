const pa11y = require('pa11y');
const { readState } = require('@dotcom-tool-kit/state');
import { Task } from '@dotcom-tool-kit/types';
import { ToolKitError } from '@dotcom-tool-kit/error';
import { Pa11ySchema }  from '@dotcom-tool-kit/types/lib/schema/pa11y'

export default class Pa11y  extends Task<typeof Pa11ySchema>  {
   static description = ''

   async run(): Promise<void> {
      const reviewState = readState('review');
		// if we've built a review app, test against that, not the app in the config
		if (reviewState) {
			this.options.host = `https://${reviewState.appName}.com`;
		}
		
		const results = await (pa11y(this.options.host));
		const issues = results.issues;

		this.logger.info(`\n Running Pa11y on ${results.pageUrl}, document title ${results.documentTitle} \n`);
		if(results.issues?.length > 0){
			results.issues.forEach((issue:any, i: number) => {
				const error = new ToolKitError((issue.typeCode == 1 ?`Pa11y failed run due to a technical fault` : `Pa11y ran successfully but there are errors in the page`));
				error.details = `Issue #${i+1} of ${issues.length}: \n TypeCode: ${issue?.typeCode} \n Type: ${issue?.type} \n Message: ${issue?.message} \n Context: ${issue?.context} \n Selector: ${issue?.selector} \n`;
				throw error
			});
		}
		if(issues.length === 0) this.logger.info(`Pa11y ran successfully, and there are no errors`);
	}
}