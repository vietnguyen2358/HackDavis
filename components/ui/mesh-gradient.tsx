"use client"

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { useInView } from 'framer-motion'

// Shader for the mesh gradient
const fragmentShader = `
  precision mediump float;
  
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uTime;

  varying vec2 vUv;
  
  //	Classic Perlin 3D Noise by Stefan Gustavson
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
  
  float cnoise(vec3 P){
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;
  
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
  
    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  
    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  
    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;
  
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
  
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
  }
  
  void main() {
    // Normalized coordinates (0 to 1)
    vec2 uv = vUv;
    
    // Create a dynamic noise value that changes over time
    float noise1 = cnoise(vec3(uv * 1.5, uTime * 0.05));
    float noise2 = cnoise(vec3(uv * 2.0, uTime * 0.03 + 10.0));
    
    // Blend the noise values
    float blendFactor = sin(uTime * 0.1) * 0.5 + 0.5;
    float mixedNoise = mix(noise1, noise2, blendFactor);
    
    // Adjust the range to get a good blend
    mixedNoise = (mixedNoise + 1.0) * 0.5;
    
    // Mix colors A, B, and C using the noise
    vec3 color;
    if (mixedNoise < 0.5) {
      // Blend from colorA to colorB
      color = mix(uColorA, uColorB, mixedNoise * 2.0);
    } else {
      // Blend from colorB to colorC
      color = mix(uColorB, uColorC, (mixedNoise - 0.5) * 2.0);
    }
    
    // Add some sparkle effect
    float sparkle = pow(max(0.0, sin(uv.x * 100.0 + uTime) * sin(uv.y * 100.0 + uTime * 0.7)), 20.0) * 0.05;
    color += vec3(sparkle);
    
    gl_FragColor = vec4(color, 1.0);
  }
`

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

function GradientMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  // Define the colors for your gradient
  const primaryColor = new THREE.Color("#4F46E5") // Indigo
  const secondaryColor = new THREE.Color("#2563EB") // Blue
  const tertiaryColor = new THREE.Color("#7DD3FC") // Light blue
  
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uColorA: { value: primaryColor },
      uColorB: { value: secondaryColor },
      uColorC: { value: tertiaryColor }
    }
  }, [])
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
    
    if (meshRef.current) {
      // Subtle movement based on mouse position or time
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.02
    }
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={3}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export function MeshGradient({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  return (
    <div
      ref={ref}
      className={`relative w-full h-full min-h-[500px] overflow-hidden ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transition: 'opacity 1.2s cubic-bezier(0.17, 0.55, 0.55, 1) 0.1s'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1.5], fov: 45 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <GradientMesh />
      </Canvas>
    </div>
  )
} 