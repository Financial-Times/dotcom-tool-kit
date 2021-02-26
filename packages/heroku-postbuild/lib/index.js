"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureHerokuPostbuildScript = void 0;
const tslib_1 = require("tslib");
const package_json_1 = tslib_1.__importDefault(require("@financial-times/package-json"));
const path_1 = tslib_1.__importDefault(require("path"));
function getPackageJson() {
    const currentDirectory = process.env.INIT_CWD || process.cwd();
    const filepath = path_1.default.resolve(currentDirectory, 'package.json');
    return package_json_1.default({ filepath });
}
function ensureHerokuPostbuildScript() {
    const packageJson = getPackageJson();
    packageJson.requireScript({
        stage: 'heroku-postbuild',
        command: 'dotcom-tool-kit heroku:postbuild'
    });
    const willWrite = packageJson.hasChangesToWrite();
    packageJson.writeChanges();
    return willWrite;
}
exports.ensureHerokuPostbuildScript = ensureHerokuPostbuildScript;
const hook = async function (options) {
    // don't try the install when we're running the command that does it silently
    if (options.id === 'heroku:install')
        return;
    const wroteScript = ensureHerokuPostbuildScript();
    if (wroteScript) {
        const name = getPackageJson().getField('name');
        this.error(new Error(`@dotcom-tool-kit/heroku-postbuild added a heroku-postbuild script to ${name}'s package.json. you should commit this.`));
    }
};
exports.default = hook;
