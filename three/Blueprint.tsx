"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ACCENT, COL, PLATE_D, PLATE_W } from "./constants";

/**
 * Phase A of the build motion: the building's plan is drawn on the ground as
 * CAD lines — podium outline, footprint, bay grid, column markers. Fades out
 * once the wireframe begins to extrude upward.
 */

const FADE_START = 0.22;
const FADE_END = 0.42;

export default function Blueprint({
  progress,
}: {
  progress: { current: number };
}) {
  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      }),
    [],
  );

  const dotMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      }),
    [],
  );

  const lineGeo = useMemo(() => {
    const pts: number[] = [];
    const w = PLATE_W / 2;
    const d = PLATE_D / 2;
    const W = (PLATE_W + 0.6) / 2;
    const D = (PLATE_D + 0.6) / 2;
    const y = 0.012;
    const rect = (hx: number, hz: number) => {
      pts.push(-hx, y, -hz, hx, y, -hz);
      pts.push(hx, y, -hz, hx, y, hz);
      pts.push(hx, y, hz, -hx, y, hz);
      pts.push(-hx, y, hz, -hx, y, -hz);
    };
    rect(W, D); // podium outline
    rect(w, d); // tower footprint
    // center axes
    pts.push(-w, y, 0, w, y, 0);
    pts.push(0, y, -d, 0, y, d);
    // wide-face bay subdivisions (match the curtain-wall mullions)
    for (const f of [-0.25, 0, 0.25]) {
      const x = f * (PLATE_W - 2 * COL);
      pts.push(x, y, -d, x, y, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  const corners = useMemo(() => {
    const cx = PLATE_W / 2 - COL / 2;
    const cz = PLATE_D / 2 - COL / 2;
    return [
      [cx, cz],
      [-cx, cz],
      [cx, -cz],
      [-cx, -cz],
    ] as Array<[number, number]>;
  }, []);

  useFrame(() => {
    const p = progress.current;
    let a = 1;
    if (p >= FADE_START) {
      const t = Math.min(1, Math.max(0, (p - FADE_START) / (FADE_END - FADE_START)));
      a = 1 - t;
    }
    lineMat.opacity = a;
    dotMat.opacity = a;
  });

  return (
    <group>
      <lineSegments geometry={lineGeo} material={lineMat} />
      {corners.map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, 0.013, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={dotMat}
        >
          <ringGeometry args={[0.05, 0.085, 24]} />
        </mesh>
      ))}
    </group>
  );
}
