import { useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { FileLoader, MathUtils, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader } from 'three'
import headImage from '../assets/avatar/head.webp'
import bodyImage from '../assets/avatar/body.webp'
import handImage from '../assets/avatar/hand.webp'
import headDepth from '../assets/avatar/head.bin?url'
import bodyDepth from '../assets/avatar/body.bin?url'
import handDepth from '../assets/avatar/hand.bin?url'

export const AVATAR_HEIGHT = 4.9
const AVATAR_WIDTH = (AVATAR_HEIGHT * 971) / 1200

const reliefGeometry = (buffer, depth) => {
  const [columns, rows] = new Uint16Array(buffer, 0, 2)
  const heights = new Uint16Array(buffer, 4)
  const geometry = new PlaneGeometry(AVATAR_WIDTH, AVATAR_HEIGHT, columns - 1, rows - 1)
  const positions = geometry.attributes.position
  for (let i = 0; i < positions.count; i += 1) positions.setZ(i, (heights[i] / 65535) * depth)
  geometry.computeVertexNormals()
  return geometry
}

// Keeps the drawing's true colours, adds studio shading and a thin rim of light on the edges.
const reliefMaterial = (texture) => {
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  const material = new MeshStandardMaterial({
    map: texture,
    emissive: '#ffffff',
    emissiveMap: texture,
    emissiveIntensity: 0.34,
    roughness: 0.68,
    envMapIntensity: 0.22,
    transparent: true,
    alphaTest: 0.06,
  })
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      float rim = pow(1.0 - saturate(dot(normalize(vViewPosition), normal)), 4.0);
      totalEmissiveRadiance += vec3(0.5, 0.62, 1.0) * rim * 0.12;`,
    )
  }
  return material
}

function Layer({ geometry, material, pivot, order }) {
  // Offsetting the mesh by its pivot lets each part rotate around its own joint.
  return <mesh geometry={geometry} material={material} position={[-pivot[0], -pivot[1], 0]} renderOrder={order} />
}

const HEAD_PIVOT = [-0.05, -0.32]
const HAND_PIVOT = [-1.0, -2.0]

export default function Avatar3D({ pointer, animate = true, ...props }) {
  const figure = useRef()
  const head = useRef()
  const hand = useRef()
  const [headBuffer, bodyBuffer, handBuffer] = useLoader(
    FileLoader,
    [headDepth, bodyDepth, handDepth],
    (loader) => loader.setResponseType('arraybuffer'),
  )
  const [headTexture, bodyTexture, handTexture] = useLoader(TextureLoader, [headImage, bodyImage, handImage])

  const parts = useMemo(
    () => ({
      head: [reliefGeometry(headBuffer, 1.2), reliefMaterial(headTexture)],
      body: [reliefGeometry(bodyBuffer, 0.8), reliefMaterial(bodyTexture)],
      hand: [reliefGeometry(handBuffer, 0.5), reliefMaterial(handTexture)],
    }),
    [headBuffer, bodyBuffer, handBuffer, headTexture, bodyTexture, handTexture],
  )

  useFrame(({ clock }, delta) => {
    if (!animate) return
    const t = clock.elapsedTime
    const px = pointer.current.x
    const py = pointer.current.y
    // The head looks further than the body turns, which is what makes it feel like a figure.
    figure.current.rotation.y = MathUtils.damp(figure.current.rotation.y, px * 0.09 + Math.sin(t * 0.4) * 0.03, 2.5, delta)
    figure.current.position.y = Math.sin(t * 0.9) * 0.018
    head.current.rotation.y = MathUtils.damp(head.current.rotation.y, px * 0.13 + Math.sin(t * 0.55) * 0.035, 3.5, delta)
    head.current.rotation.x = MathUtils.damp(head.current.rotation.x, py * 0.06 + Math.sin(t * 0.7) * 0.01, 3.5, delta)
    head.current.rotation.z = Math.sin(t * 0.5) * 0.012
    hand.current.rotation.z = Math.sin(t * 1.4) * 0.016
  })

  return (
    <group {...props}>
      <group ref={figure}>
        <Layer geometry={parts.body[0]} material={parts.body[1]} pivot={[0, 0]} order={1} />
        <group ref={head} position={[HEAD_PIVOT[0], HEAD_PIVOT[1], 0.42]}>
          <Layer geometry={parts.head[0]} material={parts.head[1]} pivot={HEAD_PIVOT} order={2} />
        </group>
        <group ref={hand} position={[HAND_PIVOT[0], HAND_PIVOT[1], 0.74]}>
          <Layer geometry={parts.hand[0]} material={parts.hand[1]} pivot={HAND_PIVOT} order={3} />
        </group>
      </group>
    </group>
  )
}
