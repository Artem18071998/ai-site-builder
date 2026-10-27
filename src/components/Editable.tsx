import { useContext, type ClipboardEvent, type ElementType, type FocusEvent, type KeyboardEvent } from 'react'
import { EditContext, type Path } from './editContext'

type Props = { path: Path; value: string; as?: ElementType; className?: string }

export function Editable({ path, value, as: Tag = 'span', className = '' }: Props) {
  const { editable, onEdit } = useContext(EditContext)

  if (!editable) return <Tag className={className}>{value}</Tag>

  return (
    <Tag
      key={value}
      className={`${className} cursor-text rounded outline-1 outline-offset-2 outline-dashed outline-transparent hover:outline-indigo-400 focus:outline-indigo-600`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.textContent ?? ''
        if (text !== value) onEdit(path, text)
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
      onPaste={(e: ClipboardEvent<HTMLElement>) => {
        e.preventDefault()
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
      }}
    >
      {value}
    </Tag>
  )
}