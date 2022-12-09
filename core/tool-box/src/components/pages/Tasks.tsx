import { styles } from '@dotcom-tool-kit/logger'
import type { TaskClass } from '@dotcom-tool-kit/types'
import { Box, Text } from 'ink'
import React, { useCallback } from 'react'
import { DetailsBox } from '../DetailsBox'
import { List } from '../List'
import { TabPageProps, ToolEssentials, useNavigation } from './shared'

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

export interface TasksPageProps extends TabPageProps {
  tasks: [string, TaskClass][]
  pluginMap: Record<string, string[]>
  hookMap: Record<string, string[]>
}

export const TasksPage = (props: TasksPageProps): JSX.Element => {
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
