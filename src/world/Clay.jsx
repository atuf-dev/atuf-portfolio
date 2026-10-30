import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  CanvasTexture,
  CatmullRomCurve3,
  LatheGeometry,
  MathUtils,
  MeshPhysicalMaterial,
  RepeatWrapping,
  SphereGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Pressing a soft sphere with a few overlapping lobes gives a hand-shaped lump of clay.
function lump(seed, strength, segments) {
  const geometry = new SphereGeometry(1, segments, Math.round(segments * 0.75))
  const positions = geometry.attributes.position
  const v = new Vector3()
  const lobes = Array.from({ length: 5 }, (_, i) => {
    const a = seed * 12.9 + i * 2.4
    const b = seed * 7.3 + i * 1.7
    return { dir: new Vector3(Math.sin(a) * Math.cos(b), Math.sin(a) * Math.sin(b), Math.cos(a)), freq: 1.4 + i * 0.75, phase: a * 3, amp: strength / (i + 1) }
  })
  for (let i = 0; i < positions.count; i += 1) {
    v.fromBufferAttribute(positions, i)
    const push = lobes.reduce((sum, lobe) => sum + Math.sin(v.dot(lobe.dir) * lobe.freq * 2 + lobe.phase) * lobe.amp, 0)
    v.multiplyScalar(1 + push)
    positions.setXYZ(i, v.x, v.y, v.z)
  }
  geometry.computeVertexNormals()
  // Close the sphere's UV seam so no line shows down the clay.
  const normals = geometry.attributes.normal
  const columns = segments + 1
  for (let row = 0; row <= Math.round(segments * 0.75); row += 1) {
    const first = row * columns
    const last = first + segments
    const x = normals.getX(first) + normals.getX(last)
    const y = normals.getY(first) + normals.getY(last)
    const z = normals.getZ(first) + normals.getZ(last)
    const length = Math.hypot(x, y, z) || 1
    normals.setXYZ(first, x / length, y / length, z / length)
    normals.setXYZ(last, x / length, y / length, z / length)
  }
  return geometry
}

function worm(points, radius, segments) {
  const curve = new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x, y, z)))
  const tube = new TubeGeometry(curve, segments * 2, radius, Math.round(segments / 2), false)
  const caps = [curve.getPoint(0), curve.getPoint(1)].map((point) => {
    const cap = new SphereGeometry(radius, Math.round(segments / 2), Math.round(segments / 3))
    cap.translate(point.x, point.y, point.z)
    return cap
  })
  return mergeGeometries([tube, ...caps])
}

function clayGrain() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(256, 256)
  for (let i = 0; i < image.data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 110
    image.data[i] = image.data[i + 1] = image.data[i + 2] = v
    image.data[i + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
  ctx.globalAlpha = 0.5
  ctx.filter = 'blur(1.2px)'
  ctx.drawImage(canvas, 0, 0)
  const texture = new CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(3.5, 2.5)
  return texture
}

export const CLAY_PALETTES = {
  light: { primary: '#ea7f2e', soft: '#f6b67e', cream: '#f7e3cf', deep: '#b84d15', plinth: '#eed3bb', glow: '#ff9330' },
  dark: { primary: '#d96f2a', soft: '#3c4668', cream: '#59648a', deep: '#252c47', plinth: '#2a3150', glow: '#ff9d4d' },
}

export function useClayMaterials(palette) {
  const materials = useMemo(() => {
    const grain = clayGrain()
    const make = () =>
      new MeshPhysicalMaterial({ roughness: 0.86, metalness: 0, sheen: 0.55, sheenRoughness: 0.7, bumpMap: grain, bumpScale: 0.6, envMapIntensity: 0.7 })
    return { primary: make(), soft: make(), cream: make(), deep: make(), plinth: make() }
  }, [])

  useEffect(() => {
    for (const [name, material] of Object.entries(materials)) {
      material.color.set(palette[name])
      material.sheenColor.set(palette[name]).lerp(materials.primary.color.clone().set('#ffffff'), 0.45)
    }
  }, [materials, palette])

  return materials
}

export function useClayShapes(narrow) {
  return useMemo(() => {
    const detail = narrow ? 40 : 72
    return {
      lump1: lump(1.3, 0.2, detail),
      lump2: lump(4.7, 0.26, detail),
      lump3: lump(8.1, 0.14, detail),
      pebble: new SphereGeometry(1, detail / 2, detail / 3),
      wormA: worm([[-1.4, -0.6, 0], [-0.7, 0.6, 0.35], [0.3, -0.25, -0.2], [1.3, 0.55, 0.15]], 0.33, detail / 2),
      wormB: worm([[-0.9, 0.9, 0], [0.5, 0.75, 0.3], [0.65, -0.15, 0], [-0.4, -0.45, -0.15], [0.3, -1, 0.1]], 0.3, detail / 2),
      plinth: new LatheGeometry(
        [[0, 0.32], [2.15, 0.32], [2.32, 0.27], [2.42, 0.14], [2.45, 0], [2.45, -0.34], [2.62, -0.4], [2.72, -0.5], [2.74, -0.9], [0, -0.9]].map(([x, y]) => new Vector2(x, y)),
        96,
      ),
    }
  }, [narrow])
}

const scratch = new Vector3()

// A lump of clay that drifts slowly, follows the cursor by depth and leans away when the cursor gets close.
export function Blob({ geometry, material, position, scale = 1, rotation = [0, 0, 0], speed = 1, depth = 1, pointer, moving }) {
  const outer = useRef()
  const inner = useRef()
  const view = useThree((state) => state.viewport.getCurrentViewport(undefined, [0, 0, 0]))
  const shift = useRef({ x: 0, y: 0 })
  const seed = useMemo(() => position[0] * 3.1 + position[1] * 5.7, [position])

  useFrame(({ clock }, delta) => {
    if (!moving) return
    const t = clock.elapsedTime
    inner.current.rotation.y = rotation[1] + t * 0.07 * speed
    inner.current.rotation.x = rotation[0] + Math.sin(t * 0.21 + seed) * 0.16

    outer.current.getWorldPosition(scratch)
    const cursorX = (pointer.current.x * view.width) / 2
    const cursorY = (-pointer.current.y * view.height) / 2
    const dx = scratch.x - shift.current.x - cursorX
    const dy = scratch.y - shift.current.y - cursorY
    const distance = Math.hypot(dx, dy) || 1
    const reach = 1.5 + scale * 0.7
    const force = Math.max(0, 1 - distance / reach) * 0.55
    const targetX = pointer.current.x * 0.14 * depth + (dx / distance) * force
    const targetY = -pointer.current.y * 0.1 * depth + (dy / distance) * force + Math.sin(t * 0.55 + seed) * 0.07 * depth
    shift.current.x = MathUtils.damp(shift.current.x, targetX, 3, delta)
    shift.current.y = MathUtils.damp(shift.current.y, targetY, 3, delta)
    outer.current.position.set(position[0] + shift.current.x, position[1] + shift.current.y, position[2])
  })

  return (
    <group ref={outer} position={position}>
      <mesh ref={inner} geometry={geometry} material={material} scale={scale} rotation={rotation} />
    </group>
  )
}
