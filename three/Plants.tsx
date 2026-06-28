"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLATE_D, PLATE_W } from "./constants";

/**
 * Landscape planting around the tower — shrubs and small trees, scaled to feel
 * realistic against the building. Shrubs are organic instanced blobs (~30–60
 * cm), trees are simple low-poly trunks + foliage clusters (~2 m). Everything
 * fades in alongside the lawn during the solid-build phase.
 */

const SHRUB_COUNT = 42;
const TREE_COUNT = 8;
const FOOT_X = PLATE_W / 2 + 0.7;
const FOOT_Z = PLATE_D / 2 + 0.7;

const FADE_START = 0.66;
const FADE_END = 0.98;

const FOLIAGE_GREENS = ["#4a5a30", "#5a6b3a", "#647546", "#3f4d28", "#506140"];
const TRUNK_COLOR = "#5a4534";

// Jitter icosahedron vertices for an organic, non-spherical foliage shape.
function jittered(geo: THREE.IcosahedronGeometry, amp: number) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * amp);
    pos.setY(i, pos.getY(i) + (Math.random() - 0.5) * amp);
    pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * amp);
  }
  geo.computeVertexNormals();
  return geo;
}

export default function Plants({
  progress,
}: {
  progress: { current: number };
}) {
  const shrubsRef = useRef<THREE.InstancedMesh>(null);
  const trunksRef = useRef<THREE.InstancedMesh>(null);
  const canopiesRef = useRef<THREE.InstancedMesh>(null);

  const shrubGeo = useMemo(
    () => jittered(new THREE.IcosahedronGeometry(0.14, 1), 0.025),
    [],
  );
  const trunkGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.028, 0.045, 0.5, 6, 1);
    g.translate(0, 0.25, 0); // pivot at base
    return g;
  }, []);
  const canopyGeo = useMemo(
    () => jittered(new THREE.IcosahedronGeometry(0.32, 1), 0.06),
    [],
  );

  const shrubMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.85,
        metalness: 0,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const trunkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: TRUNK_COLOR,
        roughness: 0.9,
        metalness: 0,
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const canopyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.8,
        metalness: 0,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  const positions = useMemo(() => {
    type Pos = { x: number; z: number };
    const shrubs: Pos[] = [];
    const trees: Pos[] = [];

    let guard = 0;
    while (shrubs.length < SHRUB_COUNT && guard < 3000) {
      guard++;
      const r = 2.0 + Math.random() * 6.5;
      const a = Math.random() * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (Math.abs(x) < FOOT_X && Math.abs(z) < FOOT_Z) continue;
      shrubs.push({ x, z });
    }

    // Trees at the perimeter, distributed angularly with jitter.
    for (let i = 0; i < TREE_COUNT; i++) {
      const a = (i / TREE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
      const r = 6.3 + Math.random() * 1.8;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      trees.push({ x, z });
    }
    return { shrubs, trees };
  }, []);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    const sh = shrubsRef.current;
    if (sh) {
      positions.shrubs.forEach((p, i) => {
        dummy.position.set(p.x, 0.05 + Math.random() * 0.03, p.z);
        dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
        const s = 0.7 + Math.random() * 0.8;
        dummy.scale.set(
          s * (0.9 + Math.random() * 0.25),
          s * (0.7 + Math.random() * 0.5),
          s * (0.9 + Math.random() * 0.25),
        );
        dummy.updateMatrix();
        sh.setMatrixAt(i, dummy.matrix);

        color.set(FOLIAGE_GREENS[(Math.random() * FOLIAGE_GREENS.length) | 0]);
        color.offsetHSL(
          0,
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.06,
        );
        sh.setColorAt(i, color);
      });
      sh.count = positions.shrubs.length;
      sh.instanceMatrix.needsUpdate = true;
      if (sh.instanceColor) sh.instanceColor.needsUpdate = true;
    }

    const tr = trunksRef.current;
    const ca = canopiesRef.current;
    if (tr && ca) {
      let trunkIdx = 0;
      let canopyIdx = 0;
      positions.trees.forEach((p) => {
        dummy.position.set(p.x, 0, p.z);
        dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
        const ts = 0.9 + Math.random() * 0.5;
        dummy.scale.set(ts * 0.9, ts, ts * 0.9);
        dummy.updateMatrix();
        tr.setMatrixAt(trunkIdx++, dummy.matrix);

        // Two overlapping canopy blobs per tree → irregular silhouette.
        for (let k = 0; k < 2; k++) {
          const ox = (Math.random() - 0.5) * 0.18;
          const oz = (Math.random() - 0.5) * 0.18;
          const oy = 0.5 + k * 0.18 + Math.random() * 0.1;
          dummy.position.set(p.x + ox, oy * ts, p.z + oz);
          dummy.rotation.set(
            Math.random() * 0.5,
            Math.random() * Math.PI * 2,
            Math.random() * 0.5,
          );
          const cs = (0.75 + Math.random() * 0.4) * ts;
          dummy.scale.set(cs, cs, cs);
          dummy.updateMatrix();
          ca.setMatrixAt(canopyIdx, dummy.matrix);
          color.set(
            FOLIAGE_GREENS[(Math.random() * FOLIAGE_GREENS.length) | 0],
          );
          color.offsetHSL(
            0,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.06,
          );
          ca.setColorAt(canopyIdx, color);
          canopyIdx++;
        }
      });
      tr.count = trunkIdx;
      ca.count = canopyIdx;
      tr.instanceMatrix.needsUpdate = true;
      ca.instanceMatrix.needsUpdate = true;
      if (ca.instanceColor) ca.instanceColor.needsUpdate = true;
    }
  }, [positions]);

  useFrame(() => {
    const p = progress.current;
    const t = Math.min(1, Math.max(0, (p - FADE_START) / (FADE_END - FADE_START)));
    shrubMat.opacity = t;
    trunkMat.opacity = t;
    canopyMat.opacity = t;
  });

  return (
    <group>
      <instancedMesh
        ref={shrubsRef}
        args={[shrubGeo, shrubMat, SHRUB_COUNT]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={trunksRef}
        args={[trunkGeo, trunkMat, TREE_COUNT]}
        frustumCulled={false}
        castShadow
      />
      <instancedMesh
        ref={canopiesRef}
        args={[canopyGeo, canopyMat, TREE_COUNT * 2]}
        frustumCulled={false}
        castShadow
      />
    </group>
  );
}
