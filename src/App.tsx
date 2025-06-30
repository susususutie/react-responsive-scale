import ResponsiveScale from './ReactResponsiveScale'
import Dashboard from './Dashboard'
import { useState, type CSSProperties } from 'react'

function App() {
  const [backgroundColor, setBackgroundColor] = useState<CSSProperties['backgroundColor']>()

  return (
    <ResponsiveScale rootWidth={800} rootHeight={600} backgroundColor={backgroundColor}>
      <Dashboard changeBackgroundColor={setBackgroundColor} />
    </ResponsiveScale>
  )
}

export default App
