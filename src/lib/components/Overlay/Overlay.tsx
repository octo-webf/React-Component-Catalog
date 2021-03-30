import React, { useCallback, useEffect } from 'react'

import './style.css'

export type Props = {
  children: React.ReactNode,
  isOpen?: boolean,
  onClose: () => void
}

const Overlay = ({ children, isOpen = false, onClose }: Props): React.ReactElement => {
  const handleEscape = useCallback((event: React.KeyboardEvent|KeyboardEvent) => {
    if (event.key === 'Escape') { onClose() }
  }, [])
  useEffect(() => {
    document.addEventListener('keydown', handleEscape, false)
    return () => {
      document.removeEventListener('keydown', handleEscape, false)
    }
  })
  return (
    <div
      tabIndex={0}
      className={`overlay ${isOpen ? '' : 'hidden'}`}
      onClick={onClose}
      onKeyPress={handleEscape}
      role="button">
      {children}
    </div>
  )
}

export default Overlay
