import React, { useState } from 'react'
import { render, Box, BoxProps, Text, useApp, useInput } from 'ink'
import { Tabs, Tab } from 'ink-tab'
import winston from 'winston'
import { loadConfig, ValidConfig } from 'dotcom-tool-kit/lib/config'
import { styles } from '@dotcom-tool-kit/logger'
import type { Hook, HookClass, Plugin, TaskClass } from '@dotcom-tool-kit/types'

const logger = winston.createLogger({ silent: true })

interface SelectableBoxProps extends BoxProps {
  selected: boolean
}
const SelectableBox = (props: React.PropsWithChildren<SelectableBoxProps>) => {
  const { selected, children, ...rest } = props
  return (
    <Box borderStyle={selected ? 'single' : undefined} paddingTop={selected ? 0 : 1} paddingX={1} {...rest}>
      {children}
    </Box>
  )
}

interface ListProps {
  items: string[]
  selected: boolean
  cursor: number
}

const List = (props: ListProps) => (
  <SelectableBox selected={props.selected} flexDirection="column">
    {props.items.map((item, index) => (
      <Box key={item}>
        <Text bold={props.cursor === index}>{item}</Text>
      </Box>
    ))}
  </SelectableBox>
)

interface ToolEssentials {
  selected: boolean
  cursor: number
}

const DetailsBox = (props: React.PropsWithChildren<SelectableBoxProps>) => (
  <SelectableBox width={72} flexDirection="column" {...props}>
    {props.children}
  </SelectableBox>
)

interface PluginDetailsProps extends ToolEssentials {
  parent?: Plugin
  hookIds: string[]
  taskIds: string[]
}

const PluginDetails = (props: PluginDetailsProps) => (
  <DetailsBox selected={props.selected}>
    <Text>
      Included by{' '}
      <Text bold={props.selected && props.cursor === 0}>
        {styles.plugin(props.parent?.id ?? 'no parent')}
      </Text>
    </Text>
    {props.hookIds.length > 0 && (
      <>
        <Text>Defines the following hooks:</Text>
        {props.hookIds.map((hookId, index) => (
          <Text key={hookId}>
            - <Text bold={props.selected && props.cursor === index + 1}>{styles.hook(hookId)}</Text>
          </Text>
        ))}
      </>
    )}
    {props.taskIds.length > 0 && (
      <>
        <Text>Defines the following tasks:</Text>
        {props.taskIds.map((taskId, index) => (
          <Text key={taskId}>
            -{' '}
            <Text bold={props.selected && props.cursor === index + 1 + props.hookIds.length}>
              {styles.task(taskId)}
            </Text>
          </Text>
        ))}
      </>
    )}
  </DetailsBox>
)

interface HookDetailsProps extends ToolEssentials {
  hook: Hook
  taskIds: string[]
  pluginIds: string[]
}

const HookDetails = (props: HookDetailsProps) => {
  return (
    <DetailsBox selected={props.selected}>
      <Text>{(props.hook.constructor as HookClass).description}</Text>
      {props.hook.plugin && <Text>Defined in the {styles.plugin(props.hook.plugin.id)} plugin</Text>}
      {props.taskIds.length > 0 && (
        <>
          <Text>Calls the following tasks:</Text>
          {props.taskIds.map((taskId, index) => (
            <Text key={taskId}>
              - <Text bold={props.selected && props.cursor === index + 1}>{styles.plugin(taskId)}</Text>
            </Text>
          ))}
        </>
      )}
      {props.pluginIds.length > 0 && (
        <>
          <Text>Appears in the following plugins:</Text>
          {props.pluginIds.map((pluginId, index) => (
            <Text key={pluginId}>
              - <Text bold={props.selected && props.cursor === index + 1}>{styles.plugin(pluginId)}</Text>
            </Text>
          ))}
        </>
      )}
    </DetailsBox>
  )
}

interface TaskDetailsProps extends ToolEssentials {
  task: TaskClass
  pluginIds: string[]
  hookIds: string[]
}

const TaskDetails = (props: TaskDetailsProps) => {
  return (
    <DetailsBox selected={props.selected}>
      <Text>{props.task.description}</Text>
      {props.task.plugin && <Text>Defined in the {styles.plugin(props.task.plugin.id)} plugin</Text>}
      {props.pluginIds.length > 0 && (
        <>
          <Text>Appears in the following plugins:</Text>
          {props.pluginIds.map((pluginId, index) => (
            <Text key={pluginId}>
              - <Text bold={props.selected && props.cursor === index + 1}>{styles.plugin(pluginId)}</Text>
            </Text>
          ))}
        </>
      )}
      {props.hookIds.length > 0 && (
        <>
          <Text>Calls the following hooks:</Text>
          {props.hookIds.map((hookId, index) => (
            <Text key={hookId}>
              - <Text bold={props.selected && props.cursor === index + 1}>{styles.hook(hookId)}</Text>
            </Text>
          ))}
        </>
      )}
    </DetailsBox>
  )
}

interface NavigationState {
  listCursor: number
  detailsCursor: number
  detailsSelected: boolean
}

const useNavigation = (
  maxListCursor: number,
  getMaxDetailsCursor: (listCursor: number) => number
): NavigationState => {
  const { exit } = useApp()
  const [listCursor, setListCursor] = useState(0)
  const [detailsCursor, setDetailsCursor] = useState(0)
  const [detailsSelected, setDetailsSelected] = useState(false)

  const maxDetailsCursor = getMaxDetailsCursor(listCursor)

  useInput((input, key) => {
    if (key.downArrow || input === 'j') {
      if (detailsSelected) {
        setDetailsCursor(detailsCursor !== maxDetailsCursor ? detailsCursor + 1 : 0)
      } else {
        setListCursor(listCursor !== maxListCursor ? listCursor + 1 : 0)
        setDetailsCursor(0)
      }
    }
    if (key.upArrow || input === 'k') {
      if (detailsSelected) {
        setDetailsCursor(detailsCursor !== 0 ? detailsCursor - 1 : maxDetailsCursor)
      } else {
        setListCursor(listCursor !== 0 ? listCursor - 1 : maxListCursor)
        setDetailsCursor(0)
      }
    }
    if (key.return || key.rightArrow || input === 'l') {
      if (detailsSelected) {
        // if (detailsCursor === 0) {
        //   const parentPluginIndex = props.plugins.findIndex(
        //     ([pluginName]) => pluginName === selectedComponent.parent!.id
        //   )
        //   if (parentPluginIndex !== -1) {
        //     setListCursor(parentPluginIndex)
        //     setDetailsCursor(0)
        //   }
        // }
      } else {
        setDetailsSelected(true)
      }
    }
    if (detailsSelected && (key.escape || key.leftArrow || input === 'h')) {
      setDetailsSelected(false)
    }
    if (input === 'q') {
      exit()
    }
  })

  return { listCursor, detailsCursor, detailsSelected }
}

interface PluginsPageProps {
  plugins: [string, Plugin][]
}

const PluginsPage = (props: PluginsPageProps) => {
  const { listCursor, detailsCursor, detailsSelected } = useNavigation(props.plugins.length - 1, (cursor) => {
    const [, plugin] = props.plugins[cursor]
    return Object.keys(plugin.module?.hooks ?? {}).length + (plugin.module?.tasks?.length ?? 0)
  })
  const [, selectedPlugin] = props.plugins[listCursor]
  return (
    <Box paddingLeft={detailsSelected ? 1 : 0}>
      <List
        items={props.plugins.map(([id]) => styles.plugin(id))}
        selected={!detailsSelected}
        cursor={listCursor}
      />
      <PluginDetails
        parent={selectedPlugin.parent}
        hookIds={Object.keys(selectedPlugin.module?.hooks ?? {})}
        taskIds={
          selectedPlugin.module?.tasks?.map((task) => task.id).filter((id): id is string => !!id) ?? []
        }
        selected={detailsSelected}
        cursor={detailsCursor}
      />
    </Box>
  )
}

interface HooksPageProps {
  hooks: [string, Hook][]
  taskMap: Record<string, string[]>
  pluginMap: Record<string, string[]>
}

const HooksPage = (props: HooksPageProps) => {
  const { listCursor, detailsCursor, detailsSelected } = useNavigation(props.hooks.length - 1, (cursor) => {
    const [hookId, hook] = props.hooks[cursor]
    return (
      (hook.plugin ? 1 : 0) + (props.taskMap[hookId]?.length ?? 0) + (props.pluginMap[hookId]?.length ?? 0)
    )
  })
  const [hookId, selectedHook] = props.hooks[listCursor]
  return (
    <Box paddingLeft={detailsSelected ? 1 : 0}>
      <List
        items={props.hooks.map(([id]) => styles.hook(id))}
        selected={!detailsSelected}
        cursor={listCursor}
      />
      <HookDetails
        hook={selectedHook}
        taskIds={props.taskMap[hookId] ?? []}
        pluginIds={props.pluginMap[hookId] ?? []}
        selected={detailsSelected}
        cursor={detailsCursor}
      />
    </Box>
  )
}

interface TasksPageProps {
  tasks: [string, TaskClass][]
  pluginMap: Record<string, string[]>
  hookMap: Record<string, string[]>
}

const TasksPage = (props: TasksPageProps) => {
  const { listCursor, detailsCursor, detailsSelected } = useNavigation(props.tasks.length - 1, (cursor) => {
    const [taskId, task] = props.tasks[cursor]
    return (
      (task.plugin ? 1 : 0) + (props.pluginMap[taskId]?.length ?? 0) + (props.hookMap[taskId]?.length ?? 0)
    )
  })
  const [taskId, selectedTask] = props.tasks[listCursor]
  return (
    <Box paddingLeft={detailsSelected ? 1 : 0}>
      <List
        items={props.tasks.map(([id]) => styles.task(id))}
        selected={!detailsSelected}
        cursor={listCursor}
      />
      <TaskDetails
        task={selectedTask}
        pluginIds={props.pluginMap[taskId] ?? []}
        hookIds={props.hookMap[taskId] ?? []}
        selected={detailsSelected}
        cursor={detailsCursor}
      />
    </Box>
  )
}

type TabName = 'plugins' | 'hooks' | 'tasks'

interface TabbedViewProps {
  config: ValidConfig
}

const TabbedView = (props: TabbedViewProps) => {
  const [activeTab, setActiveTab] = useState<TabName>('plugins')
  return (
    <>
      <Tabs
        onChange={(newTab: TabName) => setActiveTab(newTab)}
        showIndex={false}
        keyMap={{
          previous: [],
          next: []
        }}>
        <Tab name="plugins">plugins</Tab>
        <Tab name="hooks">hooks</Tab>
        <Tab name="tasks">tasks</Tab>
      </Tabs>
      {activeTab === 'plugins' && <PluginsPage plugins={Object.entries(props.config.plugins)} />}
      {activeTab === 'hooks' && (
        <HooksPage hooks={Object.entries(props.config.hooks)} taskMap={{}} pluginMap={{}} />
      )}
      {activeTab === 'tasks' && (
        <TasksPage tasks={Object.entries(props.config.tasks)} pluginMap={{}} hookMap={{}} />
      )}
    </>
  )
}

async function main() {
  const config = await loadConfig(logger)

  render(<TabbedView config={config} />)
}

main()
