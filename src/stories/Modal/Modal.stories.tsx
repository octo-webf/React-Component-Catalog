import React, { useState } from 'react'
import { Story } from '@storybook/react'
import Modal, { ModalButtonClose, ModalProps } from '../../lib/components/Modal/Modal'

const documentation = `
Courtesy of LETO (Camille Toulouse) \n
## API
\`\`\`xml
<Modal {...args} isOpen={isOpen} onModalClosed={() => setIsOpen(false)}>
  <ModalButtonClose>x</ModalButtonClose>
  <div>Try clicking outside of the modal!</div>
</Modal>
\`\`\`
learn more [here](/story/modal-study--page#version-1)
`

export default {
  title: 'Modal/Modal',
  component: Modal,
  argTypes: {
    isOpen: {
      control: false,
    },
  },
  parameters: {
    controls: { hideNoControlsWarning: true },
    componentSource: {
      url: [
        'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fcomponents%2FModal%2FModal%2Etsx/raw?ref=master',
      ],
      language: 'javascript',
    },
    docs: {
      description: {
        component: documentation,
      },
    },
  },
}

const Template: Story<ModalProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>Click Me!</button>
      <Modal {...args} isOpen={isOpen} onModalClosed={() => setIsOpen(false)}>
        <ModalButtonClose>x</ModalButtonClose>
        <div>Try clicking outside of the modal!</div>
      </Modal>
    </>
  )
}

export const Default = Template.bind({})
Default.args = {}