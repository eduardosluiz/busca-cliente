import { useEffect, useRef } from 'react'

export interface ResizerProps {
  onResize: (widthChange: number) => void
  minWidth?: number
}

export function Resizer({ onResize, minWidth = 120 }: ResizerProps) {
  const startX = useRef<number>(0)
  const isResizing = useRef(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return

      const widthChange = e.clientX - startX.current
      onResize(widthChange)
      startX.current = e.clientX
    }

    const handleMouseUp = () => {
      isResizing.current = false
      document.body.style.cursor = 'default'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onResize])

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true
    startX.current = e.clientX
    document.body.style.cursor = 'col-resize'
  }

  return (
    <div
      className="absolute right-0 top-0 bottom-0 w-1 bg-transparent cursor-col-resize hover:bg-gray-300 transition-colors"
      onMouseDown={handleMouseDown}
    />
  )
} 