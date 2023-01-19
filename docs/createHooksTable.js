/* eslint-disable */
const { readdir, readFile, access } = require('node:fs/promises')
const YAML = require('yaml')

let tableArray = []
let tasksArray = []

const fileExists = async (path) => {
  try {
    await access(path)
    return true
  } catch (err) {
    // eslint-disable-next-line
    console.log(`${path} does not exist. This plugin doesn't export any hooks or tasks`)
    return false
  }
}

// get hooks
const getHooksAndTasks = async () => {
  try {
    const plugins = await readdir('./plugins')
    for (const plugin of plugins) {
      // todo understad import ts etc here
      const indexPath = `./plugins/${plugin}/lib/index.js`
      if (await fileExists(indexPath)) {
        const pluginExports = require(`.` + indexPath) //!!I've moved this to docs so this may now be the wrong path
        // console.log(pluginExports);

        if (pluginExports.hooks) {
          // ?? how would this rule be applied here? https://eslint.org/docs/latest/rules/guard-for-in
          // eslint-disable-next-line
          for (const hook in pluginExports.hooks) {
            const tableObject = {
              name: hook,
              description: pluginExports.hooks[hook].description,
              exportedBy: plugin,
              possibleTasks: []
            }
            tableArray.push(tableObject)
          }
        }

        if (pluginExports.tasks) {
          for (const task of pluginExports.tasks) {
            tasksArray.push(task.name)
          }
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
}

// get plugins
// get hooks
// get tasks
// get toolkit.yml
// extract task / hook coupling and add to relevant hooksObject
// create table

// add comments re what's happening at each stage
// refactor / abstract

const tableHtml = `
    <style type="text/css">
    .tg  {border-collapse:collapse;border-spacing:0;}
    .tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
    overflow:hidden;padding:10px 12px;word-break:normal;}
    .tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
    font-weight:normal;overflow:hidden;padding:10px 12px;word-break:normal;}
    .tg .tg-dvid{background-color:#efefef;border-color:inherit;font-weight:bold;text-align:left;vertical-align:top}
    .tg .tg-zh46{border-color:inherit;font-family:"Courier New", Courier, monospace !important;text-align:left;vertical-align:top}
    .tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
    </style>
    <table class="tg">
    <thead>
    <tr>
        <th class="tg-dvid">Hook</th>
        <th class="tg-dvid">Description</th>
        <th class="tg-dvid">Exported by</th>
        <th class="tg-dvid">Possible Tasks</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td class="tg-zh46">build:local</td>
        <td class="tg-0pky">hook for \`npm run build\`, for building an app locally</td>
        <td class="tg-0pky">babel</td>
        <td class="tg-zh46">a<br>b<br>c<br>d</td>
    </tr>
    <tr>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
    </tr>
    <tr>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
        <td class="tg-0pky"></td>
    </tr>
    </tbody>
    </table>
`

const getPossibleTasksForHooks = async () => {
  try {
    const plugins = await readdir('./plugins')
    for (const plugin of plugins) {
      const toolKitRcFile = await readFile(`./plugins/${plugin}/.toolkitrc.yml`, 'utf8')
      const parsed = YAML.parse(toolKitRcFile)
      console.log(parsed)
    }
  } catch (err) {
    console.error(err)
  }
}

const createTable = async () => {
  await getHooksAndTasks()
  console.log('==================')
  console.log('tableArray', tableArray)
  console.log('==================')
  console.log('==================')
  console.log('tasksArray', tasksArray)
  console.log('==================')
}

createTable()
