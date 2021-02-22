TODO

- [ ] how do we get started
- [ ] pick one task to try and write
- [ ] do we want to use Oclif or something else?
- [ ] what next

- commands have a script they can run to check the app's environment is set up, that's run on install and when you run the command
   - e.g. verify command checks `eslint-config-next` is installed

- need to be able to specify plugins per-installation
   - i.e tool-kit installed in next-article needs webpack plugin, installed in next-api it doesn't
   - maybe possible using an Oclif plugin, steal bits of the @oclif/plugin-plugins codebase
