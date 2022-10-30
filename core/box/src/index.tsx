import React, { useCallback, useEffect, useState } from 'react'
import { render, Box, BoxProps, Text, useApp, useInput } from 'ink'
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
      {props.hook.plugin && (
        <Text>
          Defined in the{' '}
          <Text bold={props.selected && props.cursor === 0}>{styles.plugin(props.hook.plugin.id)}</Text>{' '}
          plugin
        </Text>
      )}
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
              -{' '}
              <Text bold={props.selected && props.cursor === index + 1 + props.taskIds.length}>
                {styles.plugin(pluginId)}
              </Text>
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
      {props.task.plugin && (
        <Text>
          Defined in the{' '}
          <Text bold={props.selected && props.cursor === 0}>{styles.plugin(props.task.plugin.id)}</Text>{' '}
          plugin
        </Text>
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
      {props.hookIds.length > 0 && (
        <>
          <Text>Is called by the following hooks:</Text>
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

interface TabPageProps {
  startingItem?: string
  onTabChange: (newTab: TabName, itemId: string | undefined) => void
}

interface NavigationArgs {
  listLength: number
  getDetailsLength: (listCursor: number) => number
  getSelectedItem: (listCursor: number, detailsCursor: number) => [TabName, string | undefined]
  findItem: (itemId: string) => number
  startingItem?: string
  changeTab: (newTab: TabName, itemId: string | undefined) => void
}

interface NavigationState {
  listCursor: number
  detailsCursor: number
  detailsSelected: boolean
}

const useNavigation = ({
  listLength,
  getDetailsLength,
  getSelectedItem,
  findItem,
  startingItem,
  changeTab
}: NavigationArgs): NavigationState => {
  const { exit } = useApp()
  const [listCursor, setListCursor] = useState(0)
  const [detailsCursor, setDetailsCursor] = useState(0)
  const [detailsSelected, setDetailsSelected] = useState(false)

  const maxListCursor = listLength - 1
  const maxDetailsCursor = getDetailsLength(listCursor) - 1

  useEffect(() => {
    if (startingItem) {
      setListCursor(findItem(startingItem))
    }
  }, [startingItem, findItem])

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
        const [newTab, itemId] = getSelectedItem(listCursor, detailsCursor)
        changeTab(newTab, itemId)
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

interface PluginsPageProps extends TabPageProps {
  plugins: [string, Plugin][]
}

const PluginsPage = (props: PluginsPageProps) => {
  const { listCursor, detailsCursor, detailsSelected } = useNavigation({
    listLength: props.plugins.length,
    getDetailsLength(cursor) {
      const [, plugin] = props.plugins[cursor]
      return 1 + Object.keys(plugin.module?.hooks ?? {}).length + (plugin.module?.tasks?.length ?? 0)
    },
    getSelectedItem(listCursor, detailsCursor) {
      const [, plugin] = props.plugins[listCursor]
      const hookLength = Object.keys(plugin.module?.hooks ?? {}).length
      if (detailsCursor === 0) {
        return ['plugins', plugin.parent?.id ?? plugin.id]
      } else if (detailsCursor <= hookLength) {
        return ['hooks', Object.keys(plugin.module?.hooks ?? {})[detailsCursor - 1]]
      } else {
        return ['tasks', (plugin.module?.tasks ?? [])[detailsCursor - 1 - hookLength].id]
      }
    },
    findItem: useCallback(
      (itemId) => {
        return props.plugins.findIndex(([pluginId]) => pluginId === itemId)
      },
      [props.plugins]
    ),
    startingItem: props.startingItem,
    changeTab: props.onTabChange
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

interface HooksPageProps extends TabPageProps {
  hooks: [string, Hook][]
  taskMap: Record<string, string[]>
  pluginMap: Record<string, string[]>
}

const HooksPage = (props: HooksPageProps) => {
  const { listCursor, detailsCursor, detailsSelected } = useNavigation({
    listLength: props.hooks.length,
    getDetailsLength(cursor) {
      const [hookId, hook] = props.hooks[cursor]
      return (
        (hook.plugin ? 1 : 0) + (props.taskMap[hookId]?.length ?? 0) + (props.pluginMap[hookId]?.length ?? 0)
      )
    },
    getSelectedItem(listCursor, detailsCursor) {
      const [hookId, hook] = props.hooks[listCursor]
      if (detailsCursor === 0 && hook.plugin) {
        return ['plugins', hook.plugin.id]
      } else if (detailsCursor <= props.taskMap[hookId]?.length ?? 0) {
        return ['tasks', props.taskMap[hookId][detailsCursor - (hook.plugin ? 1 : 0)]]
      } else {
        return [
          'plugins',
          props.pluginMap[hookId][
            detailsCursor - (props.taskMap[hookId]?.length ?? 0) - (hook.plugin ? 1 : 0)
          ]
        ]
      }
    },
    findItem: useCallback(
      (itemId) => {
        return props.hooks.findIndex(([hookId]) => hookId === itemId)
      },
      [props.hooks]
    ),
    startingItem: props.startingItem,
    changeTab: props.onTabChange
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

interface TasksPageProps extends TabPageProps {
  tasks: [string, TaskClass][]
  pluginMap: Record<string, string[]>
  hookMap: Record<string, string[]>
}

const TasksPage = (props: TasksPageProps) => {
  const { listCursor, detailsCursor, detailsSelected } = useNavigation({
    listLength: props.tasks.length,
    getDetailsLength(cursor) {
      const [taskId, task] = props.tasks[cursor]
      return (
        (task.plugin ? 1 : 0) + (props.pluginMap[taskId]?.length ?? 0) + (props.hookMap[taskId]?.length ?? 0)
      )
    },
    getSelectedItem(listCursor, detailsCursor) {
      const [taskId, task] = props.tasks[listCursor]
      if (detailsCursor === 0 && task.plugin) {
        return ['plugins', task.plugin.id]
      } else if (detailsCursor <= props.hookMap[taskId]?.length ?? 0) {
        return ['hooks', props.hookMap[taskId][detailsCursor - (task.plugin ? 1 : 0)]]
      } else {
        return [
          'plugins',
          props.pluginMap[taskId][
            detailsCursor - (props.hookMap[taskId]?.length ?? 0) - (task.plugin ? 1 : 0)
          ]
        ]
      }
    },
    findItem: useCallback(
      (itemId) => {
        return props.tasks.findIndex(([taskId]) => taskId === itemId)
      },
      [props.tasks]
    ),
    startingItem: props.startingItem,
    changeTab: props.onTabChange
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

const TabPages = ['plugins', 'hooks', 'tasks'] as const
type TabName = typeof TabPages[number]

interface TabbedViewProps {
  config: ValidConfig
}

const TabbedView = (props: TabbedViewProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const [pluginsStart, setPluginsStart] = useState<string | undefined>()
  const [hooksStart, setHooksStart] = useState<string | undefined>()
  const [tasksStart, setTasksStart] = useState<string | undefined>()
  const pluginsWithHook: Record<string, string[]> = {}
  const pluginsWithTask: Record<string, string[]> = {}
  for (const [pluginId, plugin] of Object.entries(props.config.plugins)) {
    for (const hookId of Object.keys(plugin.module?.hooks ?? {})) {
      pluginsWithHook[hookId] ??= []
      pluginsWithHook[hookId].push(pluginId)
    }
    for (const taskId of Object.keys(plugin.module?.tasks ?? {})) {
      pluginsWithTask[taskId] ??= []
      pluginsWithTask[taskId].push(pluginId)
    }
  }
  const tasksWithHook = Object.entries(props.config.hookTasks).map(
    ([hookId, hookTask]) => [hookId, hookTask.tasks] as const
  )
  const hooksWithTask: Record<string, string[]> = {}
  for (const [hookId, tasks] of tasksWithHook) {
    for (const task of tasks) {
      hooksWithTask[task] ??= []
      hooksWithTask[task].push(hookId)
    }
  }

  const handleTabChange = (newTab: TabName, itemId?: string) => {
    setActiveTab(TabPages.indexOf(newTab))
    if (itemId) {
      switch (newTab) {
        case 'plugins':
          setPluginsStart(itemId)
          break
        case 'hooks':
          setHooksStart(itemId)
          break
        case 'tasks':
          setTasksStart(itemId)
          break
      }
    }
  }
  useInput((_, key) => {
    if (key.tab) {
      if (key.shift) {
        const prevTab = activeTab - 1
        setActiveTab(prevTab < 0 ? TabPages.length - 1 : prevTab)
      } else {
        setActiveTab((activeTab + 1) % TabPages.length)
      }
    }
  })
  return (
    <>
      <Box>
        {TabPages.map((page, index) => (
          <React.Fragment key={page}>
            {index !== 0 && <Text> | </Text>}
            <Text bold={index === activeTab}>{page}</Text>
          </React.Fragment>
        ))}
      </Box>
      <Box>
        {TabPages[activeTab] === 'plugins' && (
          <PluginsPage
            plugins={Object.entries(props.config.plugins)}
            startingItem={pluginsStart}
            onTabChange={handleTabChange}
          />
        )}
        {TabPages[activeTab] === 'hooks' && (
          <HooksPage
            hooks={Object.entries(props.config.hooks)}
            taskMap={Object.fromEntries(tasksWithHook)}
            pluginMap={pluginsWithHook}
            startingItem={hooksStart}
            onTabChange={handleTabChange}
          />
        )}
        {TabPages[activeTab] === 'tasks' && (
          <TasksPage
            tasks={Object.entries(props.config.tasks)}
            pluginMap={pluginsWithTask}
            startingItem={tasksStart}
            hookMap={hooksWithTask}
            onTabChange={handleTabChange}
          />
        )}
      </Box>
    </>
  )
}

async function main() {
  const config = await loadConfig(logger)

  render(
    <React.StrictMode>
      <TabbedView config={config} />
    </React.StrictMode>
  )
}

main()
