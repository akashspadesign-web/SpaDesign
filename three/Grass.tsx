"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLATE_D, PLATE_W } from "./constants";

/**
 * Landscaped lawn around the tower. Each blade is sized to feel proportional
 * to a real building (≈5–7 cm tall vs. a ~10 m tower), so the planting reads
 * as a manicured lawn rather than oversized spikes. The lawn fades in during
 * the solid-build phase and the blades sway gently with a vertex-shader wind.
 */

const BLADE_COUNT = 6000;
const FIELD_R = 9;
const FOOT_X = PLATE_W / 2 + 0.55;
const FOOT_Z = PLATE_D / 2 + 0.55;

const FADE_START = 0.62;
const FADE_END = 0.95;

// Muted, slightly varied greens — natural lawn, not cartoon green.
const GREENS = ["#5d6f3a", "#6c7c44", "#778452", "#809063", "#4a5a32", "#6f8246"];

function makeLawnTexture(): THREE.Texture | null {
  if (typeof document === "undefined") return null;
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(s / 2, s / 2, s * 0.12, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(74,88,52,1)");
  g.addColorStop(0.55, "rgba(86,100,62,0.92)");
  g.addColorStop(1, "rgba(120,128,96,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  // Subtle noise so the lawn doesn't look like flat plastic.
  const img = ctx.getImageData(0, 0, s, s);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    img.data[i] = Math.max(0, Math.min(255, img.data[i] + n));
    img.data[i + 1] = Math.max(0, Math.min(255, img.data[i + 1] + n));
    img.data[i + 2] = Math.max(0, Math.min(255, img.data[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export default function Grass({
  progress,
}: {
  progress: { current: number };
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const lawnMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const geometry = useMemo(() => {
    // Very thin spike, ~6 cm tall, ~6 mm base — realistic blade scale.
    const g = new THREE.ConeGeometry(0.006, 0.06, 3, 1);
    g.translate(0, 0.03, 0);
    return g;
  }, []);

  const lawnTex = useMemo(makeLawnTexture, []);

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: "#ffffff", // tinted per-instance
      roughness: 0.95,
      metalness: 0,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.vertexShader =
        "uniform float uTime;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           #ifdef USE_INSTANCING
             vec3 iPos = instanceMatrix[3].xyz;
             float ph = iPos.x * 0.9 + iPos.z * 0.9;
             // Sway proportional to the blade's local height — tips move, roots hold.
             float h = position.y;
             transformed.x += sin(uTime * 1.4 + ph) * 0.35 * h;
             transformed.z += cos(uTime * 1.0 + ph * 1.3) * 0.25 * h;
           #endif`,
        );
      m.userData.shader = shader;
    };
    return m;
  }, []);

  useLayoutEffect(() => {
    const inst = mesh.current;
    if (!inst) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    // Cluster centres add patchy density variation — natural lawns aren't uniform.
    const CLUSTERS = 14;
    const clusters: Array<[number, number]> = [];
    for (let i = 0; i < CLUSTERS; i++) {
      const r = 1.5 + Math.random() * (FIELD_R - 1.8);
      const a = Math.random() * Math.PI * 2;
      clusters.push([Math.cos(a) * r, Math.sin(a) * r]);
    }

    let placed = 0;
    let guard = 0;
    while (placed < BLADE_COUNT && guard < BLADE_COUNT * 8) {
      guard++;
      let x: number, z: number;
      if (Math.random() < 0.45) {
        // Around a cluster centre — local Gaussian-ish patch.
        const [cx, cz] = clusters[(Math.random() * CLUSTERS) | 0];
        x = cx + (Math.random() - 0.5) * 1.2;
        z = cz + (Math.random() - 0.5) * 1.2;
      } else {
        // Uniform over disc with mild edge falloff.
        const r = Math.pow(Math.random(), 0.7) * FIELD_R;
        const a = Math.random() * Math.PI * 2;
        x = Math.cos(a) * r;
        z = Math.sin(a) * r;
      }
      if (Math.abs(x) < FOOT_X && Math.abs(z) < FOOT_Z) continue;
      if (Math.hypot(x, z) > FIELD_R) continue;

      dummy.position.set(x, 0, z);
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.35,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.35,
      );
      const s = 0.7 + Math.random() * 0.6;
      dummy.scale.set(
        0.85 + Math.random() * 0.3,
        s,
        0.85 + Math.random() * 0.3,
      );
      dummy.updateMatrix();
      inst.setMatrixAt(placed, dummy.matrix);

      color.set(GREENS[(Math.random() * GREENS.length) | 0]);
      color.offsetHSL(0, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.08);
      inst.setColorAt(placed, color);
      placed++;
    }
    inst.count = placed;
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  }, []);

  useFrame((state) => {
    const shader = material.userData.shader;
    if (shader) shader.uniforms.uTime.value = state.clock.elapsedTime;
    const p = progress.current;
    const t = Math.min(1, Math.max(0, (p - FADE_START) / (FADE_END - FADE_START)));
    material.opacity = t;
    if (lawnMatRef.current) lawnMatRef.current.opacity = t;
  });

  return (
    <group>
      {lawnTex && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.004, 0]}
          receiveShadow
        >
          <circleGeometry args={[FIELD_R, 64]} />
          <meshStandardMaterial
            ref={lawnMatRef}
            map={lawnTex}
            transparent
            opacity={0}
            roughness={0.95}
            metalness={0}
            depthWrite={false}
          />
        </mesh>
      )}
      <instancedMesh
        ref={mesh}
        args={[geometry, material, BLADE_COUNT]}
        frustumCulled={false}
      />
    </group>
  );
}
