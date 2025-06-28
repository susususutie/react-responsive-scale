import { ReactResponsiveScale } from './ReactResponsiveScale'
import Dashboard from './Dashboard'
import { useState, type CSSProperties } from 'react'

function App() {
  const [backgroundColor, setBackgroundColor] = useState<CSSProperties['backgroundColor']>()

  return (
    <ReactResponsiveScale rootWidth={800} rootHeight={600} backgroundColor={backgroundColor}>
      <Dashboard changeBackgroundColor={setBackgroundColor} />
    </ReactResponsiveScale>
  )
}

export default App
