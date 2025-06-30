import { useContext, type CSSProperties } from 'react'
import { ScaleContext } from './ReactResponsiveScale'

type DashboardProps = {
  changeBackgroundColor: (color: CSSProperties['backgroundColor']) => void
}

export default function Dashboard(props: DashboardProps) {
  const { changeBackgroundColor } = props

  const rs = useContext(ScaleContext)

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
      <p style={{ margin: '0 auto' }}>不管浏览器窗口尺寸如何变化，居中展示区域的宽高比恒定不变</p>

      <p style={{ margin: `${rs.calcRem(24)} auto` }}>
        可以更改全局背景色和背景图片，以搭配居中区域不同的色彩风格
        <button
          onClick={() => {
            const randomColor = `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
            changeBackgroundColor(randomColor)
          }}
        >
          更改背景色
        </button>
        或者清空背景色 <button onClick={() => changeBackgroundColor(undefined)}>清空</button>
      </p>

      <div
        style={{
          margin: 'auto',
          boxSizing: 'border-box',
          width: rs.calcWidth(50),
          height: rs.calcHeight(50),
          border: '1px solid #2196F3',
        }}
      >
        不管浏览器窗口尺寸如何变化，这个div的宽高恒为居中区域宽高的一半
      </div>
    </div>
  )
}
