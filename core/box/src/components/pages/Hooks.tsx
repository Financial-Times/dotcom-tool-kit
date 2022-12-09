import { styles } from '@dotcom-tool-kit/logger'
import type { Hook, HookClass } from '@dotcom-tool-kit/types'
import { Box, Text } from 'ink'
import React, { useCallback } from 'react'
import { DetailsBox } from '../DetailsBox'
import { List } from '../List'
import { TabPageProps, ToolEssentials, useNavigation } from './shared'

interface HookDetailsProps extends ToolEssentials {
  hook: Hook<unknown>
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

export interface HooksPageProps extends TabPageProps {
  hooks: [string, Hook<unknown>][]
  taskMap: Record<string, string[]>
  pluginMap: Record<string, string[]>
}

export const HooksPage = (props: HooksPageProps): JSX.Element => {
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
