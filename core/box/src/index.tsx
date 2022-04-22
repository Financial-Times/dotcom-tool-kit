import React, { useState } from 'react'
import { render, Box, Text, useInput, BoxProps } from 'ink'
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

interface PluginDetailsProps {
  plugin: Plugin
  selected: boolean
}
const PluginDetails = (props: PluginDetailsProps) => (
  <SelectableBox selected={props.selected} width={72} flexDirection="column">
    <Text>Included by {styles.plugin(props.plugin.parent!.id)}</Text>
    {props.plugin.hooks && Object.keys(props.plugin.hooks).length > 0 && (
      <>
        <Text>Defines the following hooks:</Text>
        {Object.keys(props.plugin.hooks).map((hook) => (
          <Text key={hook}>- {styles.hook(hook)}</Text>
        ))}
      </>
    )}
    {props.plugin.tasks && props.plugin.tasks.length > 0 && (
      <>
        <Text>Defines the following tasks:</Text>
        {props.plugin.tasks.map((task) => (
          <Text key={task.id!}>- {styles.task(task.id!)}</Text>
        ))}
      </>
    )}
  </SelectableBox>
)

interface PluginsViewProps {
  plugins: [string, Plugin][]
}

const PluginsView = (props: PluginsViewProps) => {
  const [cursor, setCursor] = useState(0)
  const [detailsSelected, setDetailsSelected] = useState(false)
  useInput((input, key) => {
    const maxCursor = props.plugins.length - 1
    if (!detailsSelected && (key.downArrow || input === 'j')) {
      setCursor(cursor === maxCursor ? 0 : cursor + 1)
    }
    if (!detailsSelected && (key.upArrow || input === 'k')) {
      setCursor(cursor === 0 ? maxCursor : cursor - 1)
    }
    if (!detailsSelected && (key.return || key.rightArrow || input === 'l')) {
      setDetailsSelected(true)
    }
    if (detailsSelected && (key.escape || key.leftArrow || input === 'h')) {
      setDetailsSelected(false)
    }
  })
  return (
    <Box paddingLeft={detailsSelected ? 1 : 0}>
      <List
        items={props.plugins.map(([id]) => styles.plugin(id))}
        selected={!detailsSelected}
        cursor={cursor}
      />
      <PluginDetails plugin={props.plugins[cursor][1]} selected={detailsSelected} />
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
