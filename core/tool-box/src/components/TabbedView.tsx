import type { ValidConfig } from 'dotcom-tool-kit/lib/config'
import { Box, Text, useInput } from 'ink'
import React, { useState } from 'react'
import { HooksPage } from './pages/Hooks'
import { PluginsPage } from './pages/Plugins'
import { TabName, TabPages } from './pages/shared'
import { TasksPage } from './pages/Tasks'

// Our styling uses ansi-colors, whereas ink uses chalk, and there's no nice
// way to convert between the two, so lets just copy the appropriate colours
// as strings.
const tabColours = { plugins: 'cyan', hooks: 'magenta', tasks: 'blueBright' }

interface TabbedViewProps {
  config: ValidConfig
}

export const TabbedView = (props: TabbedViewProps): JSX.Element => {
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
            <Text backgroundColor={index === activeTab ? tabColours[page] : undefined}>{page}</Text>
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
