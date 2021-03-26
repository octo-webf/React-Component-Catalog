import React, { useContext } from 'react'
import Context from './Context'
import { ReducerActions } from './Reducer'

const Dots: React.FC = () => {
  const { currentSlide, slideCount, dispatch } = useContext(Context)
  return (
    <ul className="dots">
      {[...Array(slideCount)].map((_, index) => (
        <li key={index} className="dot-item">
          <button
            type="button"
            onClick={() => dispatch({
              type: ReducerActions.setCurrentSlide,
              slideIndex: index,
            })}>
            <div className={`dot ${currentSlide === index ? 'active' : ''}`} />
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Dots