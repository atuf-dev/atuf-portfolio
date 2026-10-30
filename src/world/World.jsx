import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { MathUtils, PMREMGenerator, SRGBColorSpace, TextureLoader } from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { prefersReducedMotion } from '../motion.js'
import { useTheme } from '../theme.js'
import Avatar3D, { AVATAR_HEIGHT } from './Avatar3D.jsx'
import { Blob, CLAY_PALETTES, useClayMaterials, useClayShapes } from './Clay.jsx'

const CAMERA_Z = 10
const FOV = 32

const useView = () => useThree((state) => state.viewport.getCurrentViewport(undefined, [0, 0, 0]))

// Keeps a 3D group locked to a page element, so the scene scrolls and resizes with the layout.
function useElementPlacement(selector, place) {
  const view = useView()
  const element = useRef(null)
  useFrame(() => {
    if (!element.current) element.current = document.querySelector(selector)
    if (!element.current) return
    const box = element.current.getBoundingClientRect()
    const k = view.height / window.innerHeight
    place({
      box,
      k,
      x: (box.left + box.width / 2 - window.innerWidth / 2) * k,
      y: (window.innerHeight / 2 - box.top - box.height / 2) * k,
      width: box.width * k,
      height: box.height * k,
      onScreen: box.bottom > -160 && box.top < window.innerHeight + 160,
    })
  })
}

// A cluster of clay anchored to a section. Positions are fractions of the half-screen.
function ClayCluster({ selector, items, clay, shapes, pointer, moving, narrow }) {
  const group = useRef()
  const view = useView()
  useElementPlacement(selector, ({ y, onScreen }) => {
    group.current.position.y = y
    group.current.visible = onScreen
  })
  return (
    <group ref={group}>
      {items
        .filter((item) => !narrow || item.phone)
        .map((item) => {
          const [fx, fy, z] = narrow ? item.phone : item.at
          return (
            <Blob
              key={`${item.shape}-${item.at.join()}`}
              geometry={shapes[item.shape]}
              material={clay[item.tone]}
              position={[(fx * view.width) / 2, (fy * view.height) / 2, z]}
              scale={item.size * (narrow ? 0.62 : 1)}
              rotation={item.turn ?? [0, 0, 0]}
              speed={item.speed ?? 1}
              depth={item.depth ?? 1}
              pointer={pointer}
              moving={moving}
            />
          )
        })}
    </group>
  )
}

const HERO_CLAY = [
  { shape: 'lump2', tone: 'primary', size: 1.2, at: [-0.98, 0.72, -1.4], depth: 1.3, phone: [-1.5, 0.74, -1.6] },
  { shape: 'lump1', tone: 'soft', size: 1.05, at: [0.96, 0.62, -1.2], depth: 1.2, phone: [1.5, 0.66, -1.6] },
  { shape: 'lump3', tone: 'cream', size: 0.7, at: [-0.7, 0.92, -2.2], depth: 0.8 },
  { shape: 'wormA', tone: 'deep', size: 0.74, at: [-0.72, -0.06, -0.9], turn: [0.3, 0.5, 0.4], speed: 0.6, depth: 1.5, phone: [-0.95, -0.2, -0.8] },
  { shape: 'wormB', tone: 'primary', size: 0.66, at: [0.78, 0.14, -1.1], turn: [0, -0.3, 0.2], speed: 0.5, depth: 1.5, phone: [1.02, 0, -1] },
  { shape: 'lump1', tone: 'deep', size: 0.62, at: [0.96, -0.86, 0.2], depth: 1.8 },
  { shape: 'lump2', tone: 'soft', size: 0.78, at: [-0.98, -0.92, 0.2], depth: 1.8 },
  { shape: 'lump3', tone: 'soft', size: 1.3, at: [0, -0.08, -3.2], depth: 0.5, speed: 0.4, phone: [0, 0, -3.2] },
  { shape: 'pebble', tone: 'primary', size: 0.17, at: [-0.58, 0.46, 0.3], depth: 2.2, phone: [-0.72, -0.05, 0.4] },
  { shape: 'pebble', tone: 'cream', size: 0.2, at: [0.62, 0.56, 0.1], depth: 2 },
  { shape: 'pebble', tone: 'deep', size: 0.13, at: [0.3, -0.12, 1.6], depth: 2.6, phone: [0.92, -0.04, 1] },
  { shape: 'pebble', tone: 'cream', size: 0.16, at: [-0.46, -0.08, 1.2], depth: 2.4 },
  { shape: 'pebble', tone: 'primary', size: 0.2, at: [0.64, 0.24, 0.5], depth: 2.2 },
]

const FEATURE_CLAY = [
  { shape: 'lump2', tone: 'soft', size: 0.95, at: [0.1, 0.42, -2.2], depth: 1, phone: [-0.8, 0.26, -2] },
  { shape: 'wormB', tone: 'primary', size: 0.66, at: [0.98, 0.5, -1.2], speed: 0.5, depth: 1.4, phone: [1, 0.5, -1.6] },
  { shape: 'lump1', tone: 'deep', size: 0.46, at: [0.14, -0.66, 0.2], depth: 1.6 },
  { shape: 'pebble', tone: 'cream', size: 0.2, at: [0.92, -0.4, 0.6], depth: 2.2 },
  { shape: 'pebble', tone: 'primary', size: 0.14, at: [0.08, 0.52, 0.8], depth: 2.4 },
]

const WORK_CLAY = [
  { shape: 'lump3', tone: 'primary', size: 1, at: [-1.04, 0.28, -2], depth: 1, phone: [-1.1, 0.2, -2.4] },
  { shape: 'lump2', tone: 'cream', size: 1.15, at: [1.05, -0.32, -2.2], depth: 1, phone: [1.1, -0.3, -2.4] },
  { shape: 'wormA', tone: 'soft', size: 0.68, at: [-1, -0.62, -1.6], turn: [0, 0.4, 1.2], speed: 0.4 },
  { shape: 'pebble', tone: 'deep', size: 0.2, at: [0.98, 0.58, -0.4], depth: 2 },
]

const PROCESS_CLAY = [
  { shape: 'wormB', tone: 'deep', size: 0.86, at: [0.96, 0.52, -1.6], speed: 0.5, phone: [1.05, 0.72, -2] },
  { shape: 'lump1', tone: 'soft', size: 0.84, at: [-1, 0.42, -1.8], phone: [-1.1, 0.62, -2.2] },
  { shape: 'pebble', tone: 'primary', size: 0.24, at: [-0.58, 0.76, -0.2], depth: 2 },
  { shape: 'pebble', tone: 'cream', size: 0.18, at: [0.48, -0.78, 0.2], depth: 2 },
]

const ABOUT_CLAY = [
  { shape: 'lump2', tone: 'deep', size: 0.9, at: [-1.04, 0.5, -1.8], phone: [-1.12, 0.6, -2.2] },
  { shape: 'lump1', tone: 'primary', size: 0.76, at: [1.04, 0.12, -1.6], phone: [1.14, -0.5, -2.2] },
  { shape: 'pebble', tone: 'cream', size: 0.2, at: [0.95, 0.7, -0.2], depth: 2 },
]

const CTA_CLAY = [
  { shape: 'lump1', tone: 'primary', size: 1.15, at: [-0.9, 0.04, -1.6], phone: [-1.12, 0.24, -2.2] },
  { shape: 'lump2', tone: 'soft', size: 1.05, at: [0.92, 0.2, -1.8], phone: [1.12, 0.3, -2.2] },
  { shape: 'wormA', tone: 'deep', size: 0.8, at: [0.66, -0.5, -0.9], speed: 0.5 },
  { shape: 'wormB', tone: 'soft', size: 0.7, at: [-0.66, -0.52, -0.9], speed: 0.5 },
  { shape: 'pebble', tone: 'cream', size: 0.2, at: [-0.34, 0.62, 0.2], depth: 2.2 },
  { shape: 'pebble', tone: 'primary', size: 0.15, at: [0.36, 0.6, 0.4], depth: 2.4 },
]

const PAGE_CLAY = [
  { shape: 'lump2', tone: 'primary', size: 1.2, at: [1.04, 0.6, -2], phone: [1.2, 0.72, -2.4] },
  { shape: 'lump1', tone: 'soft', size: 0.95, at: [-1.28, -0.42, -2], phone: [-1.3, -0.3, -2.4] },
  { shape: 'wormB', tone: 'deep', size: 0.7, at: [0.98, -0.6, -1.4], speed: 0.5 },
  { shape: 'pebble', tone: 'cream', size: 0.22, at: [-0.96, 0.8, -0.4], depth: 2 },
  { shape: 'pebble', tone: 'primary', size: 0.15, at: [0.74, 0.1, -0.3], depth: 2 },
]

function Plinth({ clay, shapes, palette, ...props }) {
  return (
    <group {...props}>
      <mesh geometry={shapes.plinth} material={clay.plinth} />
      {/* Glowing seam, so the object looks lit from below */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.34, 0]}>
        <torusGeometry args={[2.2, 0.018, 10, 120]} />
        <meshBasicMaterial color={palette.glow} toneMapped={false} />
      </mesh>
    </group>
  )
}

function HeroFigure({ pointer, moving, onReady, clay, shapes, palette }) {
  const stage = useRef()
  useEffect(() => onReady?.(), [onReady])
  useElementPlacement('[data-stage="hero"]', ({ x, y, height, onScreen }) => {
    stage.current.position.set(x, y, 0)
    stage.current.scale.setScalar(height / (AVATAR_HEIGHT + 1.22))
    stage.current.visible = onScreen
  })
  return (
    <group ref={stage}>
      <Avatar3D pointer={pointer} animate={moving} position={[0, 0.6, 0]} />
      <Plinth clay={clay} shapes={shapes} palette={palette} position={[0, -AVATAR_HEIGHT / 2 + 0.28, 0.42]} />
    </group>
  )
}

// A real tablet model showing a project. It swings into place on scroll and leans towards the cursor.
function Device({ images, theme, selector, pointer, moving, clay, shapes, palette }) {
  const stage = useRef()
  const tablet = useRef()
  const textures = useLoader(TextureLoader, [images.light, images.dark])
  useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace
      texture.anisotropy = 8
    })
  }, [textures])
  const body = useMemo(() => new RoundedBoxGeometry(4.05, 2.42, 0.17, 6, 0.08), [])

  useElementPlacement(selector, ({ x, y, width, height, box, onScreen }) => {
    stage.current.position.set(x, y, 0)
    stage.current.scale.setScalar(Math.min(width / 5.3, height / 4))
    stage.current.visible = onScreen
    if (!moving) return
    const entry = MathUtils.clamp((box.top + box.height / 2) / window.innerHeight, 0, 1.3)
    const swing = (entry - 0.5) * 0.9
    tablet.current.rotation.y = MathUtils.damp(tablet.current.rotation.y, -0.2 + swing + pointer.current.x * 0.14, 4, 0.016)
    tablet.current.rotation.x = MathUtils.damp(tablet.current.rotation.x, -0.05 + swing * 0.4 + pointer.current.y * 0.08, 4, 0.016)
  })

  return (
    <group ref={stage}>
      <group ref={tablet} position={[0, 0.42, 0]} rotation={[-0.05, -0.2, 0]}>
        <mesh geometry={body}>
          <meshStandardMaterial color="#1b1612" roughness={0.42} metalness={0.3} envMapIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.0865]}>
          <planeGeometry args={[3.82, 2.15]} />
          <meshBasicMaterial map={textures[theme === 'light' ? 0 : 1]} toneMapped={false} />
        </mesh>
      </group>
      <Plinth clay={clay} shapes={shapes} palette={palette} position={[0, -1.32, 0]} scale={[0.76, 0.7, 0.76]} />
    </group>
  )
}

function Lighting() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    const generator = new PMREMGenerator(gl)
    const environment = generator.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = environment
    scene.environmentIntensity = 0.42
    generator.dispose()
    return () => {
      scene.environment = null
      environment.dispose()
    }
  }, [gl, scene])
  return (
    <>
      <hemisphereLight args={['#fff4e8', '#b77a50', 0.42]} />
      <directionalLight position={[-4, 6, 7]} intensity={1.55} color="#fff1df" />
      <directionalLight position={[6, 0, 3]} intensity={0.45} color="#ffd9bd" />
    </>
  )
}

function Scene({ scene, images, onReady, moving, theme }) {
  const pointer = useRef({ x: 0, y: 0 })
  const palette = CLAY_PALETTES[theme]
  const clay = useClayMaterials(palette)
  const narrow = useThree((state) => state.size.width < 760)
  const shapes = useClayShapes(narrow)
  const invalidate = useThree((state) => state.invalidate)
  const shared = { clay, shapes, pointer, moving, narrow }

  useEffect(() => {
    if (scene !== 'home') onReady?.()
    window.addEventListener('scroll', invalidate, { passive: true })
    if (!moving) return () => window.removeEventListener('scroll', invalidate)
    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('pointermove', onMove)
    }
  }, [scene, onReady, moving, invalidate])

  return (
    <>
      <Lighting />
      {scene === 'home' && (
        <>
          <ClayCluster selector=".hero" items={HERO_CLAY} {...shared} />
          <HeroFigure {...shared} palette={palette} onReady={onReady} />
          <ClayCluster selector="#featured" items={FEATURE_CLAY} {...shared} />
          <Device images={images} theme={theme} selector='[data-stage="device"]' {...shared} palette={palette} />
          <ClayCluster selector="#work" items={WORK_CLAY} {...shared} />
          <ClayCluster selector="#process" items={PROCESS_CLAY} {...shared} />
          <ClayCluster selector="#about" items={ABOUT_CLAY} {...shared} />
          <ClayCluster selector="#cta" items={CTA_CLAY} {...shared} />
        </>
      )}
      {scene === 'project' && (
        <>
          <ClayCluster selector=".project-top" items={PAGE_CLAY} {...shared} />
          <Device images={images} theme={theme} selector='[data-stage="device"]' {...shared} palette={palette} />
        </>
      )}
      {scene === 'contact' && <ClayCluster selector=".contact-top" items={PAGE_CLAY} {...shared} />}
    </>
  )
}

export default function World({ scene, images, onReady }) {
  const moving = useMemo(() => !prefersReducedMotion(), [])
  const theme = useTheme()
  return (
    <div className="world" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
        frameloop={moving ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene scene={scene} images={images} onReady={onReady} moving={moving} theme={theme} />
        </Suspense>
      </Canvas>
    </div>
  )
}
