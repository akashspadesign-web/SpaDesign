"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  ACCENT,
  COL,
  FLOOR_H,
  FLOORS,
  PAPER,
  PLATE_D,
  PLATE_T,
  PLATE_W,
  PODIUM_H,
  STONE,
} from "./constants";

/**
 * Phase C of the build motion: the solid tower fills in the wireframe. The
 * podium casts first, then each floor extrudes bottom-to-top within its slice
 * of the [SOLID_START, SOLID_END] scroll window. Earlier phases (blueprint,
 * wireframe) handle 0..SOLID_START — see Blueprint.tsx / Wireframe.tsx.
 */

const PODIUM_START = 0.55;
const PODIUM_END = 0.62;
const SOLID_START = 0.62;
const SOLID_END = 1.0;
const SOLID_SPAN = SOLID_END - SOLID_START;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

type FloorProps = {
  index: number;
  progress: { current: number };
  accent?: boolean;
};

/** One floor unit: 4 corner columns + a top plate. Pivot at the floor's base. */
function Floor({ index, progress, accent = false }: FloorProps) {
  const group = useRef<THREE.Group>(null);
  const baseY = PODIUM_H + index * FLOOR_H;

  // Each floor builds within its own slice of phase C, with slight overlap so
  // construction reads as a continuous rise rather than discrete pops.
  const start = SOLID_START + (index / FLOORS) * SOLID_SPAN;
  const end = SOLID_START + ((index + 0.9) / FLOORS) * SOLID_SPAN;

  const columnMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PAPER,
        roughness: 0.78,
        metalness: 0,
      }),
    [],
  );
  const plateMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accent ? ACCENT : STONE,
        roughness: accent ? 0.5 : 0.7,
        metalness: 0,
        emissive: accent ? new THREE.Color(ACCENT) : new THREE.Color("#000"),
        emissiveIntensity: accent ? 0.12 : 0,
      }),
    [accent],
  );
  // Curtain-wall glazing: cool-tinted, see-through, no depth-write so the
  // structure stays visible behind it.
  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#aebfc1",
        roughness: 0.12,
        metalness: 0.3,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const t = easeOut(clamp01((progress.current - start) / (end - start)));
    g.scale.y = Math.max(0.0001, t);
    g.visible = t > 0.001;
  });

  const colX = PLATE_W / 2 - COL / 2;
  const colZ = PLATE_D / 2 - COL / 2;

  // Glazing geometry: panels sit in the open band between this floor's slab
  // (below) and its plate (above), inset just behind the corner columns.
  const zFace = PLATE_D / 2 - COL / 2;
  const xFace = PLATE_W / 2 - COL / 2;
  const wideSpan = PLATE_W - 2 * COL;
  const deepSpan = PLATE_D - 2 * COL;
  const glassH = FLOOR_H - PLATE_T - 0.08;
  const glassY = (FLOOR_H - PLATE_T) / 2;
  const mullionsX = [-0.25, 0, 0.25].map((f) => f * wideSpan); // 3 bays per wide face

  return (
    // Scaling y around this group (pivot at baseY) makes the unit grow upward.
    <group ref={group} position={[0, baseY, 0]}>
      {[
        [colX, colZ],
        [-colX, colZ],
        [colX, -colZ],
        [-colX, -colZ],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, FLOOR_H / 2, z]}
          material={columnMat}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[COL, FLOOR_H, COL]} />
        </mesh>
      ))}

      {/* Glass curtain wall — front/back (wide) and left/right (deep) */}
      {[zFace, -zFace].map((z, i) => (
        <mesh key={`gw${i}`} position={[0, glassY, z]} material={glassMat}>
          <boxGeometry args={[wideSpan, glassH, 0.03]} />
        </mesh>
      ))}
      {[xFace, -xFace].map((x, i) => (
        <mesh key={`gd${i}`} position={[x, glassY, 0]} material={glassMat}>
          <boxGeometry args={[0.03, glassH, deepSpan]} />
        </mesh>
      ))}

      {/* Vertical mullions dividing the wide faces into window bays */}
      {[zFace, -zFace].map((z, zi) =>
        mullionsX.map((x, xi) => (
          <mesh
            key={`m${zi}-${xi}`}
            position={[x, glassY, z]}
            material={columnMat}
          >
            <boxGeometry args={[0.045, glassH, 0.06]} />
          </mesh>
        )),
      )}

      <mesh
        position={[0, FLOOR_H - PLATE_T / 2, 0]}
        material={plateMat}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[PLATE_W, PLATE_T, PLATE_D]} />
      </mesh>
    </group>
  );
}

export default function Building({
  progress,
}: {
  progress: { current: number };
}) {
  const podiumMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: STONE,
        roughness: 0.72,
        metalness: 0,
      }),
    [],
  );
  const podiumRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = podiumRef.current;
    if (!g) return;
    // Podium extrudes from the ground at the start of phase C.
    const t = easeOut(
      clamp01((progress.current - PODIUM_START) / (PODIUM_END - PODIUM_START)),
    );
    g.scale.y = Math.max(0.0001, t);
    g.visible = t > 0.001;
  });

  return (
    <group>
      {/* Podium — extrudes upward from the ground at the start of phase C */}
      <group ref={podiumRef}>
        <mesh
          position={[0, PODIUM_H / 2, 0]}
          material={podiumMat}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[PLATE_W + 0.6, PODIUM_H, PLATE_D + 0.6]} />
        </mesh>
      </group>

      {Array.from({ length: FLOORS }).map((_, i) => (
        <Floor
          key={i}
          index={i}
          progress={progress}
          accent={i === FLOORS - 1}
        />
      ))}
    </group>
  );
}
