import React, { useContext } from 'react'
import Context from './Context'
import { ReducerActions } from './Reducer'

export type Props = {
  children?: React.ReactNode,
}

export const Play: React.FC<Props> = ({ children = null }) => {
  const { isPlaying, dispatch } = useContext(Context)

  const Button: React.FC = () => {
    if (!children) {
      return <>{isPlaying ? 'Pause' : 'Play'}</>
    }
    if (React.Children.count(children) === 1) {
      return <>{children}</>
    }
    return (
      <>{isPlaying ? (children as React.ReactNode[])[1] : (children as React.ReactNode[])[0]}</>
    )
  }

  return (
    <button
      onClick={() => dispatch({
        type: ReducerActions.togglePlay,
      })}
      type="button">
      <Button />
    </button>
  )
}

export const Next: React.FC<Props> = ({ children = null }) => {
  const { dispatch } = useContext(Context)
  return (
    <button
      onClick={() => dispatch({
        type: ReducerActions.nextSlide,
      })}
      type="button">
      {children != null ? children : 'Next'}
    </button>
  )
}

export const Previous: React.FC<Props> = ({ children = null }) => {
  const { dispatch } = useContext(Context)
  return (
    <button
      onClick={() => dispatch({
        type: ReducerActions.previousSlide,
      })}
      type="button">
      {children != null ? children : 'Previous'}
    </button>
  )
}