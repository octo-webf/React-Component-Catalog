import React, { useEffect, useState } from 'react'
import makeCancelable from '../../../CancelablePromise'
import CanceledError from '../../../errors/CanceledError'
import useSalt from '../useSalt'

export type Option = {
  value: string,
  label?: string,
}

export type Props = {
  getOptions: (input: string) => Promise<Option[]>,
}

const AutoComplete: React.FC<Props> = ({ getOptions }) => {
  const salt = useSalt()
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState([] as Option[])
  useEffect(() => {
    const cancelable = makeCancelable(getOptions(inputValue))
    cancelable.promise.then(setOptions)
      .catch((error: Error) => {
        if (!(error instanceof CanceledError)) {
          throw error
        }
      })
    return () => cancelable.cancel()
  }, [inputValue])
  return (
    <>
      <datalist id={`data-${salt}`}>
        {options.map(({ value, label }: Option, index:number) => (
          <option value={value} label={label} key={index} />
        ))}
      </datalist>
      <input
        list={`data-${salt}`}
        value={inputValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => (
          setInputValue(event.currentTarget.value)
        )} />
    </>
  )
}

export default AutoComplete
