import React, { useState } from 'react'
import { render, Box, BoxProps, Text, useApp, useInput } from 'ink'
import BigText from 'ink-big-text'
import winston from 'winston'
import { loadConfig } from 'dotcom-tool-kit/lib/config'
import { styles } from '@dotcom-tool-kit/logger'
import type { Plugin } from '@dotcom-tool-kit/types'

const Title = () => <BigText text="dotcom-tool-kit" colors={['#AB153D', '#181E2C']} />

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

const getItemLengths = (plugin: Plugin): { hooksLength: number; tasksLength: number } => {
  const hooksLength = (plugin.hooks && Object.keys(plugin.hooks).length) ?? 0
  const tasksLength = (plugin.tasks && Object.keys(plugin.tasks).length) ?? 0
  return { hooksLength, tasksLength }
}

interface PluginDetailsProps {
  plugin: Plugin
  selected: boolean
  cursor: number
}
const PluginDetails = (props: PluginDetailsProps) => {
  const { hooksLength, tasksLength } = getItemLengths(props.plugin)
  return (
    <SelectableBox selected={props.selected} width={72} flexDirection="column">
      <Text>
        Included by{' '}
        <Text bold={props.selected && props.cursor === 0}>{styles.plugin(props.plugin.parent!.id)}</Text>
      </Text>
      {hooksLength > 0 && (
        <>
          <Text>Defines the following hooks:</Text>
          {Object.keys(props.plugin.hooks!).map((hook, index) => (
            <Text key={hook}>
              - <Text bold={props.selected && props.cursor === index + 1}>{styles.hook(hook)}</Text>
            </Text>
          ))}
        </>
      )}
      {tasksLength > 0 && (
        <>
          <Text>Defines the following tasks:</Text>
          {props.plugin.tasks!.map((task, index) => (
            <Text key={task.id!}>
              -{' '}
              <Text bold={props.selected && props.cursor === index + 1 + hooksLength}>
                {styles.task(task.id!)}
              </Text>
            </Text>
          ))}
        </>
      )}
    </SelectableBox>
  )
}

interface PluginsViewProps {
  plugins: [string, Plugin][]
}

const PluginsView = (props: PluginsViewProps) => {
  const { exit } = useApp()
  const [listCursor, setListCursor] = useState(0)
  const [detailsCursor, setDetailsCursor] = useState(0)
  const [detailsSelected, setDetailsSelected] = useState(false)

  const selectedPlugin = props.plugins[listCursor][1]

  useInput((input, key) => {
    const maxListCursor = props.plugins.length - 1
    const { hooksLength, tasksLength } = getItemLengths(selectedPlugin)
    const maxDetailsCursor = hooksLength + tasksLength
    if (key.downArrow || input === 'j') {
      if (detailsSelected) {
        setDetailsCursor(detailsCursor === maxDetailsCursor ? 0 : detailsCursor + 1)
      } else {
        setListCursor(listCursor === maxListCursor ? 0 : listCursor + 1)
        setDetailsCursor(0)
      }
    }
    if (key.upArrow || input === 'k') {
      if (detailsSelected) {
        setDetailsCursor(detailsCursor === 0 ? maxDetailsCursor : detailsCursor - 1)
      } else {
        setListCursor(listCursor === 0 ? maxListCursor : listCursor - 1)
        setDetailsCursor(0)
      }
    }
    if (key.return || key.rightArrow || input === 'l') {
      if (detailsSelected) {
        if (detailsCursor === 0) {
          const parentPluginIndex = props.plugins.findIndex(
            ([pluginName]) => pluginName === selectedPlugin.parent!.id
          )
          if (parentPluginIndex !== -1) {
            setListCursor(parentPluginIndex)
            setDetailsCursor(0)
          }
        }
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
  return (
    <Box paddingLeft={detailsSelected ? 1 : 0}>
      <List
        items={props.plugins.map(([id]) => styles.plugin(id))}
        selected={!detailsSelected}
        cursor={listCursor}
      />
      <PluginDetails plugin={selectedPlugin} selected={detailsSelected} cursor={detailsCursor} />
    </Box>
  )
}

async function main() {
  const logger = winston.createLogger({ silent: true })

  const config = await loadConfig(logger)

  render(
    <>
      <Title />
      <PluginsView plugins={Object.entries(config.plugins)} />
    </>
  )
}

main()
