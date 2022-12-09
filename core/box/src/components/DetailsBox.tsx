import React from 'react'
import { SelectableBox, SelectableBoxProps } from './SelectableBox'

export const DetailsBox = (props: React.PropsWithChildren<SelectableBoxProps>): JSX.Element => (
  <SelectableBox width={72} flexDirection="column" {...props}>
    {props.children}
  </SelectableBox>
)
