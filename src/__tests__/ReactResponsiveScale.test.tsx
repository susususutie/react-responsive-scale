import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReactResponsiveScale from '../ReactResponsiveScale/ReactResponsiveScale'

// ============ 集成测试 ============
describe('ReactResponsiveScale 组件集成测试', () => {
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
    const { container } = render(
      <ReactResponsiveScale />
    )
    
    expect(container).toBeInTheDocument()
  })
})
