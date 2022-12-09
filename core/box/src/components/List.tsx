import { Box, Text } from 'ink'
import React from 'react'
import { SelectableBox } from './SelectableBox'

export interface ListProps {
  items: string[]
  selected: boolean
  cursor: number
}

export const List = (props: ListProps): JSX.Element => (
  <SelectableBox selected={props.selected} flexDirection="column">
    {props.items.map((item, index) => (
      <Box key={item}>
        <Text bold={props.cursor === index}>{item}</Text>
      </Box>
    ))}
  </SelectableBox>
)
