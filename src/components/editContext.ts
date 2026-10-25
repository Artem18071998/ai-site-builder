import { createContext } from 'react'

export type Path = (string | number)[]

export const EditContext = createContext<{
  editable: boolean
  onEdit: (path: Path, value: string) => void
}>({ editable: false, onEdit: () => {} })