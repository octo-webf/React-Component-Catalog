import React, { useContext } from 'react'
import { Context } from './Tabs'

type Props = {
  children: React.ReactElement|React.ReactElement[],
}

// Can't use React.FC here because it assumes the type of children
// and in this instance, since we use the cloneElement,
// we can't have React.ReactNode and need React.ReactElements
const TabList = ({ children }: Props): React.ReactElement => {
  const { activeIndex, setActiveIndex } = useContext(Context)
  return (
    <ul className="tabs">
      {React.Children.map(children, (child, index) => (
        <li key={index} className="tab">
          {React.cloneElement(child, {
            active: activeIndex === index,
            onClick: () => setActiveIndex(index),
          })}
        </li>
      ))}
    </ul>
  )
}

export default TabList
