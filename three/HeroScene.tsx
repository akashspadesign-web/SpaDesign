"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import Blueprint from "./Blueprint";
import Building from "./Building";
import Grass from "./Grass";
import Plants from "./Plants";
import Wireframe from "./Wireframe";
import { TOTAL_H } from "./constants";

const PAPER = "#f2efe9";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Smooths the raw scroll MotionValue into `pRef.current` once per frame, then
 * dollies the camera back/up and tracks the rising roofline so the whole tower
 * stays framed from an empty plot (p=0) to topped-out (p=1).
 */
function Rig({
  getTarget,
  pRef,
}: {
  getTarget: () => number;
  pRef: { current: number };
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.7, 0));

  useFrame((_, delta) => {
    // Frame-rate independent smoothing toward the scroll target.
    const k = 1 - Math.pow(0.0015, delta);
    pRef.current = lerp(pRef.current, getTarget(), k);
    const p = pRef.current;

    const angle = lerp(-0.55, -0.18, p);
    const radius = lerp(6.0, 10.8, p);
    const camY = lerp(2.0, 6.4, p);

    camera.position.set(
      Math.sin(angle) * radius,
      camY,
      Math.cos(angle) * radius,
    );
    target.current.set(0, lerp(0.7, TOTAL_H * 0.55, p), 0);
    camera.lookAt(target.current);
  });

  return null;
}

export default function HeroScene({
  scroll,
  staticProgress,
}: {
  scroll?: MotionValue<number>;
  staticProgress?: number;
}) {
  // Reduced-motion path starts topped-out; scroll path builds from the plot up.
  const pRef = useRef(scroll ? 0 : staticProgress ?? 0);
  const getTarget = () => (scroll ? scroll.get() : staticProgress ?? 0);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 38, near: 0.1, far: 60, position: [-3, 2, 6] }}
      onCreated={({ gl }) => {
        // Required for the Wireframe component's rising clip plane.
        gl.localClippingEnabled = true;
      }}
    >
      <fog attach="fog" args={[PAPER, 16, 34]} />

      <ambientLight intensity={0.65} />
      <hemisphereLight
        intensity={0.45}
        color={"#fffaf2"}
        groundColor={"#d8d0c2"}
      />
      <directionalLight
        position={[6, 11, 5]}
        intensity={1.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-8, 8, 8, -8, 0.1, 30]}
        />
      </directionalLight>

      {/* Ground plot */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={"#ece6db"} roughness={0.95} />
      </mesh>

      <Grass progress={pRef} />
      <Plants progress={pRef} />

      <Blueprint progress={pRef} />
      <Wireframe progress={pRef} />
      <Building progress={pRef} />

      <Rig getTarget={getTarget} pRef={pRef} />
    </Canvas>
  );
}
