import { styles } from '@dotcom-tool-kit/logger'
import type { Plugin } from '@dotcom-tool-kit/types'
import { Box, Text } from 'ink'
import React, { useCallback } from 'react'
import { DetailsBox } from '../DetailsBox'
import { List } from '../List'
import { TabPageProps, ToolEssentials, useNavigation } from './shared'

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

interface PluginsPageProps extends TabPageProps {
  plugins: [string, Plugin][]
}

export const PluginsPage = (props: PluginsPageProps): JSX.Element => {
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
