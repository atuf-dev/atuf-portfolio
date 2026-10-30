import { Component, Suspense, createContext, lazy, useCallback, useContext, useState } from 'react'
import { supportsWebGL } from '../motion.js'
import { Footer, Header } from './Layout.jsx'

// three.js is split into its own file, so the text appears before it downloads.
const World = lazy(() => import('../world/World.jsx'))

const SceneReady = createContext(false)
export const useSceneReady = () => useContext(SceneReady)

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function Shell({ scene, images, children }) {
  const [ready, setReady] = useState(false)
  const [webgl] = useState(supportsWebGL)
  const onReady = useCallback(() => setReady(true), [])

  return (
    <SceneReady.Provider value={ready}>
      {webgl && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <World scene={scene} images={images} onReady={onReady} />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="site" id="top">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </SceneReady.Provider>
  )
}
