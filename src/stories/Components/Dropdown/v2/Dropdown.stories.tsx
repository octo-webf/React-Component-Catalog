import React from 'react'
import { Story } from '@storybook/react'
import Dropdown, { Props as DropdownProps } from '../../../../lib/components/Dropdown/v2/Dropdown'
import Menu from '../../../../lib/components/Dropdown/v2/Menu'
import Label from '../../../../lib/components/Dropdown/v2/Label'
import Content from '../../../../lib/components/Dropdown/v2/Content'

export default {
  title: 'Components/Dropdown/v2 - Label as component',
  component: Dropdown,
}

const Template: Story<DropdownProps> = (args) => (
  <>
    <Dropdown {...args} />
    <div style={{ height: '300px', background: 'cyan' }} />
  </>
)

export const Default = Template.bind({})
Default.args = {
  children: [
    <button type="button">Link 1</button>,
    <Menu>
      <Label><button type="button">Menu 1</button></Label>
      <Content>
        <button type="button">Link 2</button>
        <Menu>
          <Label><button type="button">Submenu 1</button></Label>
          <Content>
            <button type="button">Link 3</button>
            <Menu>
              <Label><button type="button">Submenu 2</button></Label>
              <Content><button type="button">Link 4</button></Content>
            </Menu>
            <button type="button">Link 5</button>
          </Content>
        </Menu>
        <button type="button">Link 6</button>
      </Content>
    </Menu>,
  ],
}

export const WithoutContent = Template.bind({})
WithoutContent.args = {
  children: [
    <button type="button">Link 1</button>,
    <Menu>
      <Label><button type="button">Menu 1</button></Label>
      <button type="button">Link 2</button>
      <Menu>
        <Label><button type="button">Submenu 1</button></Label>
        <button type="button">Link 3</button>
        <Menu>
          <Label><button type="button">Submenu 2</button></Label>
          <button type="button">Link 4</button>
        </Menu>
        <button type="button">Link 5</button>
      </Menu>
      <button type="button">Link 6</button>
    </Menu>,
  ],
}
