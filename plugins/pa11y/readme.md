# Description 
 Pa11y is your automated accessibility testing pal. It runs accessibility tests on your pages via the command line or Node.js, so you can automate your testing process. Pa11y runs automatically on the `test:review` and `test:staging` hooks, using the information about the app from the state.

# Pa11y documentation
 `https://github.com/pa11y/pa11y`

 # Installation and usage
    With Tool Kit [already set up](https://github.com/financial-times/dotcom-tool-kit#installing-and-using-tool-kit), install this plugin as a dev dependency:

    npm install --save-dev @dotcom-tool-kit/pa11y
    And add it to your repo's .toolkitrc.yml:

    plugins:
    - '@dotcom-tool-kit/pa11y'

# Pa11y configurations added on the project
    Pa11ySchema = {
        - host (string): Domain against pa11y will run,
        - wait (number): The time in milliseconds to wait before running HTML CodeSniffer on the page,
        - exceptions (array.string): An array of result codes and types that you'd like to ignore. You can find the codes for each rule in the console output and the types are error, warning, and notice. Note: warning and notice messages are ignored by default,
        - hideElements (array.string): A CSS selector to hide elements from testing, selectors can be comma separated. Elements matching this selector will be hidden from testing by styling them with visibility: hidden,
        - viewports (array.string): The viewport configuration. This can have any of the properties supported by the puppeteer setViewport method,
        - screenCapturePath (string): This allows you to capture the screen between other actions, useful to verify that the page looks as you expect before the Pa11y test runs. This action takes the form screen capture <file-path>
    }

# Default config used on the project
    '@dotcom-tool-kit/pa11y':
        host: 'https://ft.com'

# Pa11y implemented output
    When pa11y plugin runs, the output on the terminal will be a list of the issues found, followed for their `errorCode` so they can be reviewed

- Output example: 
        Running Pa11y on `The URL that Pa11y was run against`, document title `The title of the page that was tested`
    
        Issue # of total: 
            {
                code: 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H30.2',
                context: '<a href="https://example.com/"><img src="example.jpg" alt=""/></a>',
                message: 'Img element is the only content of the link, but is missing alt text. The alt text should describe the purpose of the link.',
                selector: 'html > body > p:nth-child(1) > a',
                type: 'error',
                typeCode: 1
            }
            // more issues appear here