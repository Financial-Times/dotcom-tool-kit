import { useApp, useInput } from 'ink'
import { useEffect, useState } from 'react'

export interface ToolEssentials {
  selected: boolean
  cursor: number
}

export const TabPages = ['plugins', 'hooks', 'tasks'] as const
export type TabName = typeof TabPages[number]

export interface TabPageProps {
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

export const useNavigation = ({
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
