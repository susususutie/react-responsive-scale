import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReactResponsiveScale from '../ReactResponsiveScale/ReactResponsiveScale'

// 设置 DOM 尺寸
const setupDOM = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true })
  Object.defineProperty(window, 'innerHeight', { value: height, writable: true })
  Object.defineProperty(document.documentElement, 'style', {
    value: { fontSize: '' },
    writable: true,
    configurable: true
  })
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: width, configurable: true, writable: true })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { value: height, configurable: true, writable: true })
}

// ==================== 边界值测试 ====================
describe('边界值测试', () => {
  describe('极端尺寸', () => {
    it('should handle minimum dimensions (1x1)', () => {
      setupDOM(1, 1)
      render(<ReactResponsiveScale><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should handle maximum dimensions (8K)', () => {
      setupDOM(7680, 4320)
      render(<ReactResponsiveScale><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should handle very small width', () => {
      setupDOM(100, 1080)
      render(<ReactResponsiveScale rootWidth={1920} rootHeight={1080}><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should handle very small height', () => {
      setupDOM(1920, 100)
      render(<ReactResponsiveScale rootWidth={1920} rootHeight={1080}><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })

  describe('零和负值', () => {
    it('should handle zero width', () => {
      setupDOM(0, 1080)
      render(<ReactResponsiveScale><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should handle zero height', () => {
      setupDOM(1920, 0)
      render(<ReactResponsiveScale><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should warn on negative rootValue', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(<ReactResponsiveScale rootValue={-5}><div>Test</div></ReactResponsiveScale>)
      expect(warnSpy).toHaveBeenCalled()
    })

    it('should warn on negative rootWidth', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(<ReactResponsiveScale rootWidth={-1920}><div>Test</div></ReactResponsiveScale>)
      expect(warnSpy).toHaveBeenCalled()
    })
  })

  describe('精度边界', () => {
    it('should handle precision 0', () => {
      setupDOM(1920, 1080)
      render(<ReactResponsiveScale precision={0}><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should handle precision 10', () => {
      setupDOM(1920, 1080)
      render(<ReactResponsiveScale precision={10}><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should warn on precision > 10', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      render(<ReactResponsiveScale precision={15}><div>Test</div></ReactResponsiveScale>)
      expect(warnSpy).toHaveBeenCalled()
    })
  })

  describe('防抖时间', () => {
    it('should handle wait=0', () => {
      setupDOM(1920, 1080)
      render(<ReactResponsiveScale wait={0}><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('should handle very large wait', () => {
      setupDOM(1920, 1080)
      render(<ReactResponsiveScale wait={10000}><div>Test</div></ReactResponsiveScale>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
})

// ==================== 比例测试 ====================
describe('设计稿比例测试', () => {
  it('should handle 16:9 (1920x1080)', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale rootWidth={1920} rootHeight={1080}><div>16:9</div></ReactResponsiveScale>)
    expect(screen.getByText('16:9')).toBeInTheDocument()
  })

  it('should handle 4:3 (1920x1440)', () => {
    setupDOM(1600, 1200)
    render(<ReactResponsiveScale rootWidth={1920} rootHeight={1440}><div>4:3</div></ReactResponsiveScale>)
    expect(screen.getByText('4:3')).toBeInTheDocument()
  })

  it('should handle 21:9 ultrawide', () => {
    setupDOM(2520, 1080)
    render(<ReactResponsiveScale rootWidth={2520} rootHeight={1080}><div>21:9</div></ReactResponsiveScale>)
    expect(screen.getByText('21:9')).toBeInTheDocument()
  })

  it('should handle 1:1 square', () => {
    setupDOM(1000, 1000)
    render(<ReactResponsiveScale rootWidth={1080} rootHeight={1080}><div>1:1</div></ReactResponsiveScale>)
    expect(screen.getByText('1:1')).toBeInTheDocument()
  })

  it('should handle 9:16 vertical', () => {
    setupDOM(540, 960)
    render(<ReactResponsiveScale rootWidth={540} rootHeight={960}><div>9:16</div></ReactResponsiveScale>)
    expect(screen.getByText('9:16')).toBeInTheDocument()
  })

  it('should handle custom non-standard ratio', () => {
    setupDOM(1366, 768)
    render(<ReactResponsiveScale rootWidth={1366} rootHeight={768}><div>custom</div></ReactResponsiveScale>)
    expect(screen.getByText('custom')).toBeInTheDocument()
  })
})

// ==================== 容器比例测试 ====================
describe('容器比例测试', () => {
  it('should handle wider container than design', () => {
    setupDOM(2560, 1080)
    render(<ReactResponsiveScale rootWidth={1920} rootHeight={1080}><div>wider</div></ReactResponsiveScale>)
    expect(screen.getByText('wider')).toBeInTheDocument()
  })

  it('should handle taller container than design', () => {
    setupDOM(1920, 1440)
    render(<ReactResponsiveScale rootWidth={1920} rootHeight={1080}><div>taller</div></ReactResponsiveScale>)
    expect(screen.getByText('taller')).toBeInTheDocument()
  })

  it('should handle exact match ratio', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale rootWidth={1920} rootHeight={1080}><div>exact</div></ReactResponsiveScale>)
    expect(screen.getByText('exact')).toBeInTheDocument()
  })
})

// ==================== 背景测试 ====================
describe('背景样式测试', () => {
  it('should handle hex background color', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale backgroundColor="#ffffff"><div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle rgb background color', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale backgroundColor="rgb(255, 0, 0)"><div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle named background color', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale backgroundColor="transparent"><div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle background image URL', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale backgroundImage="https://example.com/bg.jpg"><div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle both background color and image', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale backgroundColor="#000" backgroundImage="url(/bg.jpg)"><div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})

// ==================== 样式合并测试 ====================
describe('样式合并测试', () => {
  it('should merge style object', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale style={{ zIndex: 100 }}><div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should merge multiple style properties', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale style={{ opacity: 0.5, pointerEvents: 'none' }}><div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle empty style object', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale style={{}}><div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})

// ==================== 子元素测试 ====================
describe('子元素渲染测试', () => {
  it('should render string child', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale>Hello World</ReactResponsiveScale>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should render multiple children', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale><span>A</span><span>B</span><span>C</span></ReactResponsiveScale>)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('should render null children gracefully', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale>{null}<div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should render undefined children gracefully', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale>{undefined}<div>Test</div></ReactResponsiveScale>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should render array children', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale>{['A', 'B', 'C'].map((item) => (<span key={item}>{item}</span>))}</ReactResponsiveScale>)
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})

// ==================== 组件组合测试 ====================
describe('组件组合测试', () => {
  it('should handle fragment children', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale><><div>A</div><div>B</div></></ReactResponsiveScale>)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('should render with custom component child', () => {
    setupDOM(1920, 1080)
    const FancyDiv = () => <div>Ref</div>
    render(<ReactResponsiveScale><FancyDiv /></ReactResponsiveScale>)
    expect(screen.getByText('Ref')).toBeInTheDocument()
  })

  it('should handle portal-like structure', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale><div>Portal</div></ReactResponsiveScale>)
    expect(screen.getByText('Portal')).toBeInTheDocument()
  })
})

// ==================== 参数组合测试 ====================
describe('参数组合测试', () => {
  it('should handle all custom parameters', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale rootValue={20} rootWidth={1280} rootHeight={720} precision={3} wait={500} backgroundColor="#000" style={{ opacity: 0.9 }}><div>Full</div></ReactResponsiveScale>)
    expect(screen.getByText('Full')).toBeInTheDocument()
  })

  it('should handle mixed valid and invalid params', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale rootValue={16} precision={-1} wait={300}><div>Mixed</div></ReactResponsiveScale>)
    expect(warnSpy).toHaveBeenCalled()
  })

  it('should use defaults when params not provided', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale><div>Defaults</div></ReactResponsiveScale>)
    expect(screen.getByText('Defaults')).toBeInTheDocument()
  })
})

// ==================== 卸载和重新渲染 ====================
describe('生命周期测试', () => {
  it('should unmount cleanly', () => {
    setupDOM(1920, 1080)
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<ReactResponsiveScale><div>Unmount</div></ReactResponsiveScale>)
    expect(screen.getByText('Unmount')).toBeInTheDocument()
    unmount()
    expect(removeSpy).toHaveBeenCalled()
  })

  it('should re-render with new props', () => {
    setupDOM(1920, 1080)
    const { rerender } = render(<ReactResponsiveScale rootValue={16}><div>Re-render</div></ReactResponsiveScale>)
    expect(screen.getByText('Re-render')).toBeInTheDocument()
    rerender(<ReactResponsiveScale rootValue={20}><div>Re-render</div></ReactResponsiveScale>)
    expect(screen.getByText('Re-render')).toBeInTheDocument()
  })

  it('should handle rapid prop changes', () => {
    setupDOM(1920, 1080)
    const { rerender } = render(<ReactResponsiveScale rootWidth={1920}><div>Rapid</div></ReactResponsiveScale>)
    for (let i = 0; i < 10; i++) {
      rerender(<ReactResponsiveScale rootWidth={1920 + i}><div>Rapid</div></ReactResponsiveScale>)
    }
    expect(screen.getByText('Rapid')).toBeInTheDocument()
  })
})

// ==================== 特殊内容测试 ====================
describe('特殊内容测试', () => {
  it('should handle unicode text', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale><div>你好世界 🌍</div></ReactResponsiveScale>)
    expect(screen.getByText('你好世界 🌍')).toBeInTheDocument()
  })

  it('should handle emoji in children', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale><div>🎉🎊🎁</div></ReactResponsiveScale>)
    expect(screen.getByText('🎉🎊🎁')).toBeInTheDocument()
  })

  it('should handle special HTML characters', () => {
    setupDOM(1920, 1080)
    render(<ReactResponsiveScale><div>&lt;script&gt;alert('xss')&lt;/script&gt;</div></ReactResponsiveScale>)
    expect(screen.getByText("<script>alert('xss')</script>")).toBeInTheDocument()
  })
})
