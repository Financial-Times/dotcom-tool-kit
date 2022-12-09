import { Box, BoxProps } from 'ink'
import React from 'react'

export interface SelectableBoxProps extends BoxProps {
  selected: boolean
}

export const SelectableBox = (props: React.PropsWithChildren<SelectableBoxProps>): JSX.Element => {
  const { selected, children, ...rest } = props
  return (
    <Box borderStyle={selected ? 'single' : undefined} paddingTop={selected ? 0 : 1} paddingX={1} {...rest}>
      {children}
    </Box>
  )
}
