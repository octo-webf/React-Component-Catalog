import React from 'react'
import { Story } from '@storybook/react'
import Tabs, { Props as TabsProps } from '../../../lib/components/Tabs/v0/Tabs'

import { ReactComponent as CodeBrackets } from '../../assets/code-brackets.svg'
import { ReactComponent as Comments } from '../../assets/comments.svg'

const documentation = `
## API
\`\`\`xml
const content = [
  {label: 'Tab 1', content: 'Content 1'},
  {label: 'Tab 2', content: 'Content 2'},
]
<Tabs tabs={content} />
\`\`\`
learn more [here](/story/tabs-study--page#version-0)
`

export default {
  title: 'Components/Tabs/v0 [DEPRECATED]',
  component: Tabs,
  parameters: {
    componentSource: {
      url: 'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fcomponents%2FTabs%2Fv0%2FTabs%2Etsx/raw?ref=master',
      language: 'javascript',
    },
    docs: {
      description: {
        component: documentation,
      },
    },
  },
}

const Template: Story<TabsProps> = (args) => <Tabs {...args} />

export const Default = Template.bind({})
Default.args = {
  tabs: [
    { label: 'Tab 1', content: 'Content 1' },
    { label: 'Tab 2', content: 'Content 2' },
  ],
}

export const WithIcons = Template.bind({})
WithIcons.args = {
  tabs: [
    { label: <CodeBrackets />, content: 'Content 1' },
    { label: <Comments />, content: 'Content 2' },
  ],
}