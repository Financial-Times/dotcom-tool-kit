# Description 
 Pa11y is your automated accessibility testing pal. It runs accessibility tests on your pages via the command line or Node.js, so you can automate your testing process.
 Pa11y requires Node.js 12+ to run

# Pa11y documentation
 `https://github.com/pa11y/pa11y#javascript-interface`

# instalation
  `npm install pa11y`

# Options

    -V, --version                  output the version number
    -n, --environment              output details about the environment Pa11y will run in
    -s, --standard <name>          the accessibility standard to use: WCAG2A, WCAG2AA (default), WCAG2AAA – only used by htmlcs runner
    -r, --reporter <reporter>      the reporter to use: cli (default), csv, json
    -e, --runner <runner>          the test runners to use: htmlcs (default), axe
    -l, --level <level>            the level of issue to fail on (exit with code 2): error, warning, notice
    -T, --threshold <number>       permit this number of errors, warnings, or notices, otherwise fail with exit code 2
    -i, --ignore <ignore>          types and codes of issues to ignore, a repeatable value or separated by semi-colons
    --include-notices              Include notices in the report
    --include-warnings             Include warnings in the report
    -R, --root-element <selector>  a CSS selector used to limit which part of a page is tested
    -E, --hide-elements <hide>     a CSS selector to hide elements from testing, selectors can be comma separated
    -c, --config <path>            a JSON or JavaScript config file
    -t, --timeout <ms>             the timeout in milliseconds
    -w, --wait <ms>                the time to wait before running tests in milliseconds
    -d, --debug                    output debug messages
    -S, --screen-capture <path>    a path to save a screen capture of the page to
    -A, --add-rule <rule>          WCAG 2.1 rules to include, a repeatable value or separated by semi-colons – only used by htmlcs runner
    -h, --help                     output usage information

# Running Tests

    Run an accessibility test against a URL:

    pa11y https://example.com
    Run an accessibility test against a file (absolute paths only, not relative):

    pa11y ./path/to/your/file.html
    Run a test with CSV reporting and save to a file:

    pa11y --reporter csv https://example.com > report.csv

# Exit Codes

    The command-line tool uses the following exit codes:

    0: Pa11y ran successfully, and there are no errors
    1: Pa11y failed run due to a technical fault
    2: Pa11y ran successfully but there are errors in the page
    By default, only accessibility issues with a type of error will exit with a code of 2. This is configurable with the --level flag which can be set to one of the following:

    error: exit with a code of 2 on errors only, exit with a code of 0 on warnings and notices
    warning: exit with a code of 2 on errors and warnings, exit with a code of 0 on notices
    notice: exit with a code of 2 on errors, warnings, and notices
    none: always exit with a code of 0

# Tutorials and articles
    You can find some useful tutorials and articles in the Tutorials section of pa11y.org.

# Common Questions and Troubleshooting
    See our Troubleshooting guide at `https://github.com/pa11y/pa11y/blob/master/TROUBLESHOOTING.md` to get the answers to common questions about Pa11y, along with some ideas to help you troubleshoot any problems.

# Pa11y configurations added on the project
    Pa11ySchema = {
        host: 'string?',
        wait: 'number?',
        tests: 'array.string?',
        exceptions: 'array.string?',
        hide: 'array.string?',
        viewports: 'array.string?',
        screenCapturePath: 'string?'
    }

# Default config used on the project
    '@dotcom-tool-kit/pa11y':
        host: 'https://ft.com'

# Pa11y implemented output
    When pa11y plugin runs, the output on the terminal will be a list of the issues found, followed for their `errorCode` so they can be reviewed
