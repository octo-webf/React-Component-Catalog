// Courtesy of LETO (Camille Toulouse) (modified)
import React from 'react'

import './style.css'

type OverlayProps = {
  onClick: () => void
}

export const Overlay = ({ onClick }: OverlayProps): React.ReactElement => (
  <div
    className="overlay"
    onClick={onClick}
    onKeyPress={(event: React.KeyboardEvent) => (event.key === 'Escape' && onClick())}
    role="presentation" />
)

type ContentProps = {
  children: React.ReactNode,
}

export const Content = ({ children }: ContentProps): React.ReactElement => <div className="modal">{children}</div>

export type ModalProps = {
  children: React.ReactElement|React.ReactElement[],
  isOpen: boolean,
  onModalClosed: (_: boolean) => void,
}

export const Modal = ({ children, isOpen, onModalClosed }: ModalProps): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = React.useState(true)
  const modalChildren = React.Children.map(children, (child) => React.cloneElement(child, {
    isModalOpen,
    onModalClosed: (value: boolean) => { setIsModalOpen(value); return onModalClosed(value) },
  }))

  return isOpen ? (
    <>
      <Overlay onClick={() => onModalClosed(false)} />
      <Content>
        {modalChildren}
      </Content>
    </>
  )
    : null
}

type ModalButtonCloseProps = {
  children: React.ReactNode,
  onModalClosed?: (_: boolean) => void
}

export const ModalButtonClose = ({
  children, onModalClosed,
}: ModalButtonCloseProps): React.ReactElement => (
  <div
    className="btnClose">
    <button onClick={() => onModalClosed(false)} type="button">{children}</button>
  </div>
)

export default Modal
