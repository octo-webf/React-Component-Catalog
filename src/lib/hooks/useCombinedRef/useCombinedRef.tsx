import {
  ForwardedRef, RefObject, useLayoutEffect, useRef,
} from 'react'

export default function useCombinedRef<T>(...forwardedRefs: ForwardedRef<T>[]): RefObject<T> {
  const localRef = useRef<T>()
  useLayoutEffect(() => {
    forwardedRefs.forEach((ref) => {
      if (ref == null) {
        return
      }
      if (typeof ref === 'function') {
        ref(localRef?.current)
      } else {
        // Need to assign to ref to sync
        // eslint-disable-next-line no-param-reassign
        ref.current = localRef.current
      }
    })
  }, [forwardedRefs, localRef])
  return localRef
}
