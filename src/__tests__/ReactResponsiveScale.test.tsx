import '@testing-library/jest-dom'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import ReactResponsiveScale from '../ReactResponsiveScale/ReactResponsiveScale'

// 模拟 jsdom 环境下的 DOM 尺寸
const setMockDimensions = (width: number, height: number) => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: width, configurable: true, writable: true })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { value: height, configurable: true, writable: true })
}

describe('ReactResponsiveScale 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setMockDimensions(1920, 1080)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render children correctly', () => {
    render(
      <ReactResponsiveScale>
        <div data-testid="content">Test Content</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('should apply default props', () => {
    render(
      <ReactResponsiveScale>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should accept custom rootValue', () => {
    render(
      <ReactResponsiveScale rootValue={20}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should accept custom rootWidth and rootHeight', () => {
    render(
      <ReactResponsiveScale rootWidth={1280} rootHeight={720}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should accept custom precision', () => {
    render(
      <ReactResponsiveScale precision={2}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should accept custom wait time', () => {
    render(
      <ReactResponsiveScale wait={100}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should accept backgroundColor', () => {
    render(
      <ReactResponsiveScale backgroundColor="#000000">
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should accept backgroundImage', () => {
    render(
      <ReactResponsiveScale backgroundImage="url(/bg.jpg)">
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should accept custom style', () => {
    render(
      <ReactResponsiveScale style={{ background: 'red' }}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should render empty when no children', () => {
    const { container } = render(<ReactResponsiveScale />)
    expect(container).toBeInTheDocument()
  })

  it('should handle zero dimensions', () => {
    setMockDimensions(0, 0)
    render(
      <ReactResponsiveScale>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle wide aspect ratio (width > height)', () => {
    setMockDimensions(1920, 540)
    render(
      <ReactResponsiveScale rootWidth={1920} rootHeight={1080}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle tall aspect ratio (height > width)', () => {
    setMockDimensions(960, 1080)
    render(
      <ReactResponsiveScale rootWidth={1920} rootHeight={1080}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle exact aspect ratio match', () => {
    setMockDimensions(1920, 1080)
    render(
      <ReactResponsiveScale rootWidth={1920} rootHeight={1080}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle custom rootHeight', () => {
    render(
      <ReactResponsiveScale rootHeight={720}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should clean up resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const { unmount } = render(
      <ReactResponsiveScale>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    
    expect(screen.getByText('Test')).toBeInTheDocument()
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalled()
  })

  it('should run timers', () => {
    render(
      <ReactResponsiveScale backgroundColor="#ff0000">
        <div>Test</div>
      </ReactResponsiveScale>
    )
    act(() => {
      vi.runAllTimers()
    })
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle negative precision warning', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <ReactResponsiveScale precision={-1}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(console.warn).toHaveBeenCalled()
  })

  it('should handle invalid rootValue warning', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <ReactResponsiveScale rootValue={0}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(console.warn).toHaveBeenCalled()
  })

  it('should handle invalid rootWidth warning', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <ReactResponsiveScale rootWidth={-1}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(console.warn).toHaveBeenCalled()
  })

  it('should handle invalid wait warning', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <ReactResponsiveScale wait={-1}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(console.warn).toHaveBeenCalled()
  })

  it('should render multiple instances', () => {
    render(
      <>
        <ReactResponsiveScale>
          <div>Instance 1</div>
        </ReactResponsiveScale>
        <ReactResponsiveScale>
          <div>Instance 2</div>
        </ReactResponsiveScale>
      </>
    )
    expect(screen.getByText('Instance 1')).toBeInTheDocument()
    expect(screen.getByText('Instance 2')).toBeInTheDocument()
  })

  it('should handle nested children', () => {
    render(
      <ReactResponsiveScale>
        <div>
          <span>Nested</span>
        </div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Nested')).toBeInTheDocument()
  })

  it('should handle large precision value', () => {
    render(
      <ReactResponsiveScale precision={10}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle very small wait value', () => {
    render(
      <ReactResponsiveScale wait={0}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle 4:3 aspect ratio', () => {
    setMockDimensions(1600, 1200)
    render(
      <ReactResponsiveScale rootWidth={1920} rootHeight={1440}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle 1:1 aspect ratio', () => {
    setMockDimensions(1000, 1000)
    render(
      <ReactResponsiveScale rootWidth={1080} rootHeight={1080}>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle small container dimensions', () => {
    setMockDimensions(100, 100)
    render(
      <ReactResponsiveScale>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle large container dimensions', () => {
    setMockDimensions(3840, 2160)
    render(
      <ReactResponsiveScale>
        <div>Test</div>
      </ReactResponsiveScale>
    )
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
