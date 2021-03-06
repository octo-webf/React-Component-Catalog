import React from 'react'
import { Story } from '@storybook/react'
import Accordion, {
  AccordeonItem, AccordeonLabel, AccordeonPanel, AccordeonProps,
} from '../../../lib/components/Accordion/Accordion'
import documentation from './Accordion.doc'

export default {
  title: 'Components/Accordion/Accordion - By Camille',
  component: Accordion,
  argTypes: {
    isOpen: {
      control: false,
    },
  },
  parameters: {
    componentSource: {
      url: [
        'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fcomponents%2FAccordion%2FAccordion%2Etsx/raw?ref=master',
        'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fcomponents%2FAccordion%2Fstyle%2Ecss/raw?ref=master',
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

const Template: Story<AccordeonProps> = (args) => <Accordion {...args} />

export const Default = Template.bind({})
Default.args = {
  children: [
    <AccordeonItem>
      <AccordeonLabel>Lorem ipsum dolor sit amet?</AccordeonLabel>
      <AccordeonPanel>
        Lorem ipsum dolor sit amet,
        consectetur adipiscing elit,
        sed do eiusmod tempo interdum velit.
      </AccordeonPanel>
    </AccordeonItem>,
    <AccordeonItem>
      <AccordeonLabel>Ut enim ad minim veniam?</AccordeonLabel>
      <AccordeonPanel>
        Lorem ipsum dolor sit amet, fermentum dui.
        Maecenas ultricies mi eget mauris pharetra et ultrices neque.
        Ac tortor vitae purus faucibus ornare suspendisse sed nisi.
        Ut morbi tincidunt augue interdum velit.
      </AccordeonPanel>
    </AccordeonItem>,
    <AccordeonItem>
      <AccordeonLabel>Lorem ipsum dolor sit amet?</AccordeonLabel>
      <AccordeonPanel>
        <img className="accordeon__image" src="https://picsum.photos/id/237/300" alt="random" />
      </AccordeonPanel>
    </AccordeonItem>,
    <AccordeonItem>
      <AccordeonLabel>Ut enim ad minim veniam?</AccordeonLabel>
      <AccordeonPanel>
        Lorem rhoncus est pellentesque elit ullamcorper.
        Dolor sed viverra ipsum nunc aliquet bibendum enim facilisis.
        Ut morbi tincidunt augue interdum velit.
      </AccordeonPanel>
    </AccordeonItem>,
    <AccordeonItem>
      <AccordeonLabel>Lorem ipsum dolor sit amet?</AccordeonLabel>
      <AccordeonPanel>
        Lorem ipsum dolor sit amet,
        consectetur adipiscing elit,
        sed do eiusmod tempo interdum velit.
      </AccordeonPanel>
    </AccordeonItem>,
  ],
}
