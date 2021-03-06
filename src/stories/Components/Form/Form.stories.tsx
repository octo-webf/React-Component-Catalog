import React, { useState } from 'react'
import { Story } from '@storybook/react'
import Form, { FormState, Props as FormProps } from '../../../lib/components/Form/Form'
import documentation from './Form.doc'

export default {
  title: 'Components/Form/Form',
  component: Form,
  parameters: {
    controls: { hideNoControlsWarning: true },
    componentSource: {
      url: [
        'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fcomponents%2FForm%2FForm%2Etsx/raw?ref=master',
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

const Template: Story<FormProps> = () => {
  const [form, setForm] = useState<FormState>(null)
  return (
    <Form onChange={setForm}>
      <input id="id-1" type="email" required minLength={10} />
      { form && !form.content['id-1'].pristine && !form.content['id-1'].validity.valid && <span>Email is not valid!</span> }
      { form && form.content['id-1'].validity.valid && <span>Yay! Nice email</span> }
      <button type="submit" disabled={!form || !form.valid}>Submit</button>
    </Form>
  )
}

export const Default = Template.bind({})
Default.args = {}

const GenericTemplate: Story<FormProps> = (args) => (
  <Form {...args} />
)

export const nestedFields = GenericTemplate.bind({})
nestedFields.args = {
  children: [
    <input id="input" />,
    <div style={{ background: 'cyan', padding: '5px' }}>
      <input id="input-nested" required />
      <div style={{ background: 'pink', padding: '5px' }}>
        <input id="input-nested-2" required />
      </div>
    </div>,
  ],
}

export const defaultValues = GenericTemplate.bind({})
defaultValues.args = {
  children: [
    <input id="input" defaultValue="Default value" />,
  ],
}

export const otherFieldTypes = GenericTemplate.bind({})
otherFieldTypes.args = {
  children: [
    <input id="input" placeholder="<input />" />,
    <textarea id="textarea" placeholder="<textarea />" />,
    <select id="select" placeholder="<select />">
      <option>Maybe</option>
      <option>Blouge</option>
      <option>200</option>
      <option>Also</option>
    </select>,
  ],
}

export const withEventHandlers = GenericTemplate.bind({})
withEventHandlers.args = {
  children: [
    /* eslint-disable-next-line no-console */
    <input id="input" placeholder="logs on change" onChange={() => console.log('input changed')} />,
    /* eslint-disable-next-line no-console */
    <input id="input" placeholder="logs on blur" onBlur={() => console.log('input blur')} />,
  ],
}

export const withSubmit = GenericTemplate.bind({})
withSubmit.args = {
  children: [
    <input id="input" />,
    /* eslint-disable-next-line no-console */
    <button type="submit" onClick={() => console.log('Submitting')}>Submit</button>,
  ],
  /* eslint-disable-next-line no-console */
  onSubmit: console.log,
}
