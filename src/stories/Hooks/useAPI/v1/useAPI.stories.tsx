import React, { useEffect, useState } from 'react'
import { Story } from '@storybook/react'
import { AxiosResponse } from 'axios'
import useAPI from '../../../../lib/hooks/useAPI/v1/useAPI'
import APIContext, { Props as APIContextProps } from '../../../../lib/hooks/useAPI/v1/Context'
import { APIClassConstructor } from '../../../../lib/hooks/useAPI/APIClass'
import MyAPI from '../MyAPI'
import MySecondAPI from '../MySecondAPI'
import makeCancelable from '../../../../lib/CancelablePromise'
import CanceledError from '../../../../lib/errors/CanceledError'
import documentation from './useAPI.doc'

export default {
  title: 'Hooks/useAPI/v1 - APIs as props',
  parameters: {
    componentSource: {
      url: [
        'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fhooks%2FuseAPI%2Fv1%2FContext%2Etsx/raw?ref=master',
        'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fhooks%2FuseAPI%2FAPIClass%2Etsx/raw?ref=master',
        'https://gitlab.com/api/v4/projects/24477877/repository/files/src%2Flib%2Fhooks%2FuseAPI%2Fv1%2FuseAPI%2Etsx/raw?ref=master',
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

const SingleAPIComponent = ({ timeout = false }: {timeout?: boolean}): React.ReactElement => {
  const [file, setFile] = useState<string>(null)
  const API = useAPI<MyAPI>()
  useEffect(() => {
    const cancelablePromise = makeCancelable<AxiosResponse>(
      (timeout) ? API.getFileWithTimeout() : API.getFile(),
    )
    cancelablePromise.promise.then((response) => setFile(response.data))
      .catch((error) => {
        if (error instanceof CanceledError || (error.response && error.response.status === 401)) {
          // Muting CanceledError and Unauthorized since it is the expected behavior
          return null
        }
        throw error
      })
    return () => cancelablePromise.cancel()
  }, [])
  return (
    <div style={{ whiteSpace: 'pre' }}>
      {(file != null) ? file : 'waiting...'}
    </div>
  )
}

const Template: Story<APIContextProps<APIClassConstructor<MyAPI>>> = (args) => (
  <APIContext {...args} />
)

export const Default = Template.bind({})
Default.args = {
  url: 'https://gitlab.com/api/v4',
  APIClass: MyAPI,
  children: [
    <SingleAPIComponent />,
  ],
}

const Template2: Story<APIContextProps<APIClassConstructor<MyAPI>>> = (args) => {
  const [content, setContent] = useState(
    <SingleAPIComponent timeout />,
  )
  useEffect(() => {
    setTimeout(() => {
      setContent(null)
    }, 100)
  }, [])

  return (
    <APIContext {...args}>
      {content}
    </APIContext>
  )
}

export const Unmount = Template2.bind({})
Unmount.args = {
  url: 'https://gitlab.com/api/v4',
  APIClass: MyAPI,
}

const MultiAPIComponent1 = (): React.ReactElement => {
  const [file, setFile] = useState<string>(null)
  const API = useAPI<MyAPI>('gitlab')
  useEffect(() => {
    const promise = makeCancelable<AxiosResponse>(API.getFile())
    promise.promise.then((response) => setFile(response.data))
    promise.promise.catch()
    return () => promise.cancel()
  }, [])
  return (
    <div style={{ whiteSpace: 'pre' }}>
      {(file != null) ? file : 'waiting...'}
    </div>
  )
}

const MultiAPIComponent2 = (): React.ReactElement => {
  const [file, setFile] = useState<string>(null)
  const API = useAPI<MySecondAPI>('also gitlab')
  useEffect(() => {
    const promise = makeCancelable<AxiosResponse>(API.getFile())
    promise.promise.then((response) => setFile(response.data))
    promise.promise.catch()
    return () => promise.cancel()
  }, [])
  return (
    <div style={{ whiteSpace: 'pre' }}>
      {(file != null) ? file : 'waiting...'}
    </div>
  )
}

export const MultipleAPI = Template.bind({})
MultipleAPI.args = {
  APIs: [
    {
      name: 'gitlab',
      url: 'https://gitlab.com/api/v4',
      APIClass: MyAPI,
    },
    {
      name: 'also gitlab',
      url: 'https://gitlab.com/api/v4',
      APIClass: MySecondAPI,
    },
  ],
  children: [
    <MultiAPIComponent1 />,
    <MultiAPIComponent2 />,
  ],
}

export const withToken = Template.bind({})
withToken.args = {
  url: 'https://gitlab.com/api/v4',
  APIClass: MyAPI,
  token: 'your token goes here',
  children: [
    <div>
      By checking the Network tab of the dev tools,
      you can see that the header &ldquo;Authorization&rdquo; was added
    </div>,
    <SingleAPIComponent />,
  ],
}
