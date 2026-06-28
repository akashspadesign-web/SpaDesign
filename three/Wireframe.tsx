"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  COL,
  FLOOR_H,
  FLOORS,
  PLATE_D,
  PLATE_W,
  PODIUM_H,
  TOTAL_H,
} from "./constants";

/**
 * Phase B of the build motion: the full tower is drawn as a wireframe — podium
 * box edges, column verticals, floor-plate outlines — revealed bottom-to-top by
 * a horizontal clipping plane that rises with scroll. The wireframe fades out
 * over phase C as the solid materials fill in.
 */

const WF_START = 0.18;
const WF_END = 0.55;
const FADE_START = 0.55;
const FADE_END = 1.0;

const smoothstep = (x: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Wireframe({
  progress,
}: {
  progress: { current: number };
}) {
  const clipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    [],
  );

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#1a1a1a",
        transparent: true,
        opacity: 1,
        depthWrite: false,
        clippingPlanes: [clipPlane],
      }),
    [clipPlane],
  );

  const geometry = useMemo(() => {
    const pts: number[] = [];
    const w = PLATE_W / 2;
    const d = PLATE_D / 2;
    const W = (PLATE_W + 0.6) / 2;
    const D = (PLATE_D + 0.6) / 2;
    const cx = w - COL / 2;
    const cz = d - COL / 2;

    const rect = (y: number, hx: number, hz: number) => {
      pts.push(-hx, y, -hz, hx, y, -hz);
      pts.push(hx, y, -hz, hx, y, hz);
      pts.push(hx, y, hz, -hx, y, hz);
      pts.push(-hx, y, hz, -hx, y, -hz);
    };

    // Podium box: bottom rect, top rect, 4 vertical edges
    rect(0, W, D);
    rect(PODIUM_H, W, D);
    for (const [x, z] of [
      [W, D],
      [-W, D],
      [W, -D],
      [-W, -D],
    ]) {
      pts.push(x, 0, z, x, PODIUM_H, z);
    }

    // Tower columns from podium top to roof
    for (const [x, z] of [
      [cx, cz],
      [-cx, cz],
      [cx, -cz],
      [-cx, -cz],
    ]) {
      pts.push(x, PODIUM_H, z, x, TOTAL_H, z);
    }

    // Floor plate outlines at each level
    for (let i = 0; i <= FLOORS; i++) {
      rect(PODIUM_H + i * FLOOR_H, w, d);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame(() => {
    const p = progress.current;
    // Build-line rises through the structure during phase B.
    const phase = smoothstep(p, WF_START, WF_END);
    clipPlane.constant = phase * (TOTAL_H + 0.15);
    // Wireframe fades as the solid takes over.
    material.opacity = 1 - smoothstep(p, FADE_START, FADE_END);
  });

  return <lineSegments geometry={geometry} material={material} />;
}
