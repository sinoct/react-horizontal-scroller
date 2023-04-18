import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react'

type Props = {
  children: JSX.Element
}

const HorizontalScroller: React.FC<Props> = ({ children }) => {
  console.log('horizontal')
  const [dynamicHeight, setDynamicHeight] = useState<number | null>(null)
  const [translateX, setTranslateX] = useState<number>(0)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const objectRef = useRef<HTMLDivElement | null>(null)

  const calcDynamicHeight = (objectWidth: number) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    return objectWidth - vw + vh
  }

  const handleDynamicHeight = (
    ref: MutableRefObject<HTMLDivElement | undefined>,
    setDynamicHeight: Dispatch<SetStateAction<null | number>>,
  ) => {
    if (ref.current) {
      const objectWidth = ref.current.scrollWidth
      const dynamicHeight = calcDynamicHeight(objectWidth)
      setDynamicHeight(dynamicHeight)
    }
  }

  const resizeHandler = () => {
    handleDynamicHeight(objectRef as MutableRefObject<HTMLDivElement>, setDynamicHeight)
  }

  const applyScrollListener = (ref: MutableRefObject<HTMLDivElement | undefined>) => {
    if (ref.current) {
      resizeHandler()
      const offsetTop = -ref.current.offsetTop
      //   const objectWidth = ref.current.scrollWidth;
      //   const vw = window.innerWidth;
      //   const clientRect = ref.current.getBoundingClientRect();
      console.log(offsetTop)
      setTranslateX(offsetTop)
    }
  }

  useEffect(() => {
    handleDynamicHeight(objectRef as MutableRefObject<HTMLDivElement>, setDynamicHeight)
    window.addEventListener('resize', resizeHandler)
    window.addEventListener('scroll', () => applyScrollListener(containerRef as MutableRefObject<HTMLDivElement>))
    return () => {
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('scroll', () => applyScrollListener(containerRef as MutableRefObject<HTMLDivElement>))
    }
  }, [])

  useEffect(() => {
    resizeHandler()
    applyScrollListener(containerRef as MutableRefObject<HTMLDivElement>)
  }, [])

  return (
    <div
      className='relative w-full bg-transparent will-change-transform'
      style={{ height: dynamicHeight ?? undefined }}
    >
      <div className='sticky top-nav h-full-without-nav w-full overflow-x-hidden bg-transparent' ref={containerRef}>
        <div style={{ transform: ` translate3d(${translateX}px, 0, 0)` }}>{children}</div>
      </div>
    </div>
  )
}

export default HorizontalScroller
