import { format } from 'pretty-format'

export const removeRoots = (config) => {
  // HACK:IM:20250207 the configs that are loaded include absolute paths in
  // them which are unsuitable for snapshots (as they will differ from
  // machine-to-machine). we can't mock away the logic that sets the config
  // file paths as it's needed when loading the options schemas. we also can't
  // reliably edit the config object before passing it to Jest as it's very
  // deep and contains many circular references (this also precludes using
  // JSON.stringify.) instead let's call the same pretty-format function Jest
  // calls. i'm using similar options to what Jest uses so that the diff this
  // creates is understandable.
  const stringified = format(config, {
    escapeRegex: true,
    indent: 2,
    printFunctionName: false,
    escapeString: false,
    printBasicPrototype: false
  })
  // HACK:IM:20250207 replaceAll does exist in Node 18 but we don't need to
  // edit the tsconfig.json just for this file as test files aren't
  // type-checked anyway
  return stringified.replaceAll(`${process.cwd()}/`, '')
}
