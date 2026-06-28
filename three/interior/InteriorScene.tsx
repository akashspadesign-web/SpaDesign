"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

/**
 * Scroll-built bedroom interior. The motion mirrors the building hero: an
 * empty room is drawn as a plan, walls rise, then furniture pieces materialise
 * one after another — rug, bed, nightstand & lamp, painting, plant — until a
 * finished bedroom is staged. Each piece animates in its own slice of the
 * scroll window; the camera dollies from an overview down to an interior view.
 */

// ---------- Room dimensions (units ≈ meters) ----------
const ROOM_W = 4.6;
const ROOM_D = 3.6;
const WALL_H = 2.55;
const WALL_T = 0.08;
const FLOOR_T = 0.05;
const HALF_W = ROOM_W / 2;
const HALF_D = ROOM_D / 2;

// ---------- Materials — light-oak Japandi palette (matches reference) ----------
const WALL_COLOR = "#ece4d2";       // warm off-white plaster
const FLOOR_COLOR = "#d4b27c";      // light oak plank
const OAK = "#cba07a";              // light oak — bed, desk, slats, chair frame
const OAK_DARK = "#a07550";         // darker oak for joinery + headboard sides
const OAK_LIGHT = "#dfba8a";        // pale highlight for slat-wall verticals
const CREAM = "#f6efe1";            // mattress sheet
const DUVET = "#c4a886";            // tan/taupe duvet — matches reference
const DUVET_SOFT = "#d8c4a4";       // lighter throw/runner
const PILLOW = "#f0e8d6";           // warm white pillow
const SOFA = "#c8b89a";             // beige upholstery
const SOFA_DARK = "#a89878";        // deeper crease colour
const RUG_BODY = "#ddcfb2";         // pale rug
const RUG_TRIM = "#b89066";
const POT = "#a26a48";              // terracotta (single accent, like the reference)
const FOLIAGE = "#506a3e";
const BRASS = "#caa66a";
const SHADE = "#f7e8c8";
const ACCENT = "#e8771a";
const INK = "#1a1a1a";
const CURTAIN = "#e8e0cf";          // sheer cream curtain

// ---------- Phase windows ----------
const PLAN_FADE_START = 0.10;
const PLAN_FADE_END = 0.22;
const WALL_START = 0.16;
const WALL_END = 0.34;
const RUG_START = 0.40;
const RUG_END = 0.48;
const BED_FRAME_START = 0.46;
const BED_FRAME_END = 0.56;
const BEDDING_START = 0.56;
const BEDDING_END = 0.62;
const NIGHTSTAND_START = 0.66;
const NIGHTSTAND_END = 0.72;
const SLAT_WALL_START = 0.30;
const SLAT_WALL_END = 0.40;
const CURTAIN_START = 0.34;
const CURTAIN_END = 0.42;
const SOFA_START = 0.62;
const SOFA_END = 0.70;
const LAMP_START = 0.68;
const LAMP_END = 0.74;
const DESK_START = 0.72;
const DESK_END = 0.80;
const CHAIR_START = 0.78;
const CHAIR_END = 0.84;
const PAINTING_START = SLAT_WALL_START; // kept for SlatWall reuse
const PAINTING_END = SLAT_WALL_END;
const PLANT_START = 0.86;
const PLANT_END = 0.94;
const FINAL_GLOW_START = 0.94;
const FINAL_GLOW_END = 1.0;

// ---------- Helpers ----------
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A piece that materialises in [start, end] — scales up with optional drop-in lift. */
function Piece({
  start,
  end,
  progress,
  position = [0, 0, 0],
  lift = 0,
  children,
}: {
  start: number;
  end: number;
  progress: { current: number };
  position?: [number, number, number];
  lift?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const [px, py, pz] = position;
  useFrame(() => {
    const t = easeOut(clamp01((progress.current - start) / (end - start)));
    const g = ref.current;
    if (!g) return;
    g.scale.setScalar(Math.max(0.0001, t));
    g.position.set(px, py + (1 - t) * -lift, pz);
    g.visible = t > 0.001;
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

// ---------- Floor plan (Phase A — CAD lines on the ground) ----------
function FloorPlan({ progress }: { progress: { current: number } }) {
  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      }),
    [],
  );

  const geo = useMemo(() => {
    const pts: number[] = [];
    const y = 0.011;
    const rect = (cx: number, cz: number, hx: number, hz: number) => {
      pts.push(cx - hx, y, cz - hz, cx + hx, y, cz - hz);
      pts.push(cx + hx, y, cz - hz, cx + hx, y, cz + hz);
      pts.push(cx + hx, y, cz + hz, cx - hx, y, cz + hz);
      pts.push(cx - hx, y, cz + hz, cx - hx, y, cz - hz);
    };
    // room outline
    rect(0, 0, HALF_W, HALF_D);
    // bed footprint
    rect(0, -0.65, 0.8, 1.0);
    // nightstand
    rect(-1.2, -1.1, 0.27, 0.27);
    // rug
    rect(0, -0.2, 1.3, 1.05);
    // plant
    rect(1.65, 1.1, 0.2, 0.2);
    // doorway swing arc (simplified line)
    pts.push(-1.6, y, HALF_D - 0.05, -0.5, y, HALF_D - 0.05);

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame(() => {
    const p = progress.current;
    let a = 1;
    if (p > PLAN_FADE_START) {
      a =
        1 -
        clamp01((p - PLAN_FADE_START) / (PLAN_FADE_END - PLAN_FADE_START));
    }
    mat.opacity = a;
  });

  return <lineSegments geometry={geo} material={mat} />;
}

// ---------- Room shell (Phase B — floor + walls rise) ----------
function RoomShell({ progress }: { progress: { current: number } }) {
  const floor = useRef<THREE.Group>(null);
  const back = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = progress.current;
    const t = easeOut(clamp01((p - WALL_START) / (WALL_END - WALL_START)));
    // Floor first, then walls catch up — staggered slightly for narrative beat.
    const tFloor = easeOut(
      clamp01((p - WALL_START) / (WALL_END - WALL_START - 0.04)),
    );
    if (floor.current) {
      floor.current.scale.y = Math.max(0.0001, tFloor);
      floor.current.visible = tFloor > 0.001;
    }
    [back.current, left.current, right.current].forEach((g) => {
      if (!g) return;
      g.scale.y = Math.max(0.0001, t);
      g.visible = t > 0.001;
    });
  });

  return (
    <group>
      {/* Floor (extrudes from zero thickness) */}
      <group ref={floor}>
        <mesh position={[0, FLOOR_T / 2, 0]} receiveShadow>
          <boxGeometry args={[ROOM_W, FLOOR_T, ROOM_D]} />
          <meshStandardMaterial color={FLOOR_COLOR} roughness={0.7} />
        </mesh>
      </group>

      {/* Back wall (z = -HALF_D) */}
      <group ref={back}>
        <mesh position={[0, WALL_H / 2 + FLOOR_T, -HALF_D - WALL_T / 2]} receiveShadow>
          <boxGeometry args={[ROOM_W + WALL_T * 2, WALL_H, WALL_T]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.85} />
        </mesh>
      </group>

      {/* Left wall */}
      <group ref={left}>
        <mesh
          position={[-HALF_W - WALL_T / 2, WALL_H / 2 + FLOOR_T, 0]}
          receiveShadow
        >
          <boxGeometry args={[WALL_T, WALL_H, ROOM_D]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.85} />
        </mesh>
      </group>

      {/* Right wall */}
      <group ref={right}>
        <mesh
          position={[HALF_W + WALL_T / 2, WALL_H / 2 + FLOOR_T, 0]}
          receiveShadow
        >
          <boxGeometry args={[WALL_T, WALL_H, ROOM_D]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.85} />
        </mesh>
      </group>

      {/* Baseboards (subtle dark line on back wall) */}
      <Piece
        start={WALL_END - 0.02}
        end={WALL_END + 0.04}
        progress={progress}
        position={[0, 0.05, -HALF_D + 0.005]}
      >
        <mesh>
          <boxGeometry args={[ROOM_W, 0.08, 0.01]} />
          <meshStandardMaterial color={OAK_DARK} roughness={0.7} />
        </mesh>
      </Piece>

      {/* Tall window on the left wall — daylit, slightly emissive so it reads
          as a bright window even in dimmer ambient. */}
      <Piece
        start={WALL_END - 0.01}
        end={WALL_END + 0.06}
        progress={progress}
        position={[-HALF_W + 0.015, FLOOR_T + 1.05, 0.2]}
      >
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.4, 1.8, 0.02]} />
          <meshStandardMaterial
            color={"#f3edd9"}
            roughness={0.18}
            metalness={0.04}
            emissive={"#f7ecc8"}
            emissiveIntensity={0.45}
          />
        </mesh>
      </Piece>
    </group>
  );
}

// ---------- Rug ----------
function Rug({ progress }: { progress: { current: number } }) {
  return (
    <Piece
      start={RUG_START}
      end={RUG_END}
      progress={progress}
      position={[0, FLOOR_T + 0.003, -0.2]}
    >
      <mesh receiveShadow>
        <boxGeometry args={[2.6, 0.015, 2.1]} />
        <meshStandardMaterial color={RUG_BODY} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.18, 64]} />
        <meshStandardMaterial color={RUG_TRIM} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
    </Piece>
  );
}

// ---------- Bed (frame, mattress, headboard, bedding, pillows) ----------
function Bed({ progress }: { progress: { current: number } }) {
  return (
    <group>
      {/* Frame — drops in first */}
      <Piece
        start={BED_FRAME_START}
        end={BED_FRAME_END}
        progress={progress}
        position={[0, FLOOR_T + 0.16, -0.55]}
        lift={0.25}
      >
        {/* base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.32, 2.05]} />
          <meshStandardMaterial color={OAK} roughness={0.6} />
        </mesh>
        {/* mattress */}
        <mesh position={[0, 0.27, 0]} castShadow>
          <boxGeometry args={[1.62, 0.22, 1.97]} />
          <meshStandardMaterial color={CREAM} roughness={0.9} />
        </mesh>
        {/* headboard */}
        <mesh position={[0, 0.55, -1.04]} castShadow>
          <boxGeometry args={[1.75, 1.0, 0.07]} />
          <meshStandardMaterial color={OAK_DARK} roughness={0.55} />
        </mesh>
      </Piece>

      {/* Bedding — duvet + pillows, comes in slightly after */}
      <Piece
        start={BEDDING_START}
        end={BEDDING_END}
        progress={progress}
        position={[0, FLOOR_T + 0.45, -0.55]}
        lift={0.15}
      >
        {/* duvet on lower 2/3 */}
        <mesh position={[0, 0.0, 0.25]} castShadow>
          <boxGeometry args={[1.62, 0.06, 1.4]} />
          <meshStandardMaterial color={DUVET} roughness={0.85} />
        </mesh>
        {/* pillow left */}
        <mesh
          position={[-0.38, 0.06, -0.72]}
          rotation={[0, 0.05, 0]}
          castShadow
        >
          <boxGeometry args={[0.62, 0.14, 0.34]} />
          <meshStandardMaterial color={PILLOW} roughness={0.95} />
        </mesh>
        {/* pillow right */}
        <mesh
          position={[0.38, 0.06, -0.72]}
          rotation={[0, -0.05, 0]}
          castShadow
        >
          <boxGeometry args={[0.62, 0.14, 0.34]} />
          <meshStandardMaterial color={PILLOW} roughness={0.95} />
        </mesh>
        {/* throw blanket folded at foot */}
        <mesh position={[0, 0.04, 0.78]} castShadow>
          <boxGeometry args={[1.4, 0.05, 0.32]} />
          <meshStandardMaterial color={DUVET_SOFT} roughness={0.85} />
        </mesh>
      </Piece>
    </group>
  );
}

// ---------- Nightstand ----------
function Nightstand({ progress }: { progress: { current: number } }) {
  return (
    <Piece
      start={NIGHTSTAND_START}
      end={NIGHTSTAND_END}
      progress={progress}
      position={[-1.2, FLOOR_T + 0.25, -1.1]}
      lift={0.2}
    >
      {/* body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.5, 0.55]} />
        <meshStandardMaterial color={OAK} roughness={0.55} />
      </mesh>
      {/* drawer reveal (subtle horizontal line) */}
      <mesh position={[0, 0.0, 0.281]}>
        <boxGeometry args={[0.45, 0.012, 0.005]} />
        <meshStandardMaterial color={"#1a1310"} roughness={0.6} />
      </mesh>
      {/* small knob */}
      <mesh position={[0, 0.05, 0.286]} castShadow>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial color={BRASS} roughness={0.4} metalness={0.7} />
      </mesh>
    </Piece>
  );
}

// ---------- Lamp on the nightstand ----------
function Lamp({ progress }: { progress: { current: number } }) {
  const shadeMat = useRef<THREE.MeshStandardMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = progress.current;
    // Lamp turns on smoothly at the very end of the build.
    const glow =
      easeOut(clamp01((p - FINAL_GLOW_START) / (FINAL_GLOW_END - FINAL_GLOW_START))) *
      1.4;
    if (shadeMat.current) shadeMat.current.emissiveIntensity = 0.4 + glow;
    if (lightRef.current) lightRef.current.intensity = glow * 1.6;
  });

  return (
    <Piece
      start={LAMP_START}
      end={LAMP_END}
      progress={progress}
      position={[-1.2, FLOOR_T + 0.5, -1.1]}
      lift={0.15}
    >
      {/* base disc */}
      <mesh position={[0, 0.025, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.05, 18]} />
        <meshStandardMaterial color={BRASS} roughness={0.45} metalness={0.6} />
      </mesh>
      {/* stem */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.32, 12]} />
        <meshStandardMaterial color={BRASS} roughness={0.45} metalness={0.6} />
      </mesh>
      {/* shade */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.18, 18, 1, true]} />
        <meshStandardMaterial
          ref={shadeMat}
          color={SHADE}
          roughness={0.65}
          emissive={"#f0c98a"}
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.42, 0]}
        intensity={0}
        distance={3}
        decay={2}
        color={"#ffcf88"}
      />
    </Piece>
  );
}

// ---------- Writing desk against the right wall ----------
function Desk({ progress }: { progress: { current: number } }) {
  // Desk sits against the right wall, facing the centre of the room.
  // Local origin: desk centre, on the floor.
  return (
    <Piece
      start={DESK_START}
      end={DESK_END}
      progress={progress}
      position={[1.55, FLOOR_T, 1.0]}
      lift={0.2}
    >
      {/* Top slab */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.04, 1.1]} />
        <meshStandardMaterial color={OAK} roughness={0.55} />
      </mesh>
      {/* Apron under the top (front edge stiffener) */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.5, 0.04, 1.0]} />
        <meshStandardMaterial color={OAK_DARK} roughness={0.7} />
      </mesh>
      {/* Two side legs spanning the depth */}
      <mesh position={[0, 0.35, -0.5]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.04]} />
        <meshStandardMaterial color={OAK} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.35, 0.5]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.04]} />
        <meshStandardMaterial color={OAK} roughness={0.55} />
      </mesh>
      {/* Small books stacked on the desk */}
      <mesh position={[-0.05, 0.795, -0.35]} rotation={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.22, 0.04, 0.16]} />
        <meshStandardMaterial color={"#7a4a36"} roughness={0.8} />
      </mesh>
      <mesh position={[-0.05, 0.83, -0.34]} rotation={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[0.2, 0.035, 0.15]} />
        <meshStandardMaterial color={"#2c3a44"} roughness={0.8} />
      </mesh>
      {/* A small brass tray / desk object */}
      <mesh position={[0.08, 0.77, 0.25]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.012, 18]} />
        <meshStandardMaterial color={BRASS} roughness={0.4} metalness={0.6} />
      </mesh>
    </Piece>
  );
}

// ---------- Chair pulled out from the desk ----------
function Chair({ progress }: { progress: { current: number } }) {
  return (
    <Piece
      start={CHAIR_START}
      end={CHAIR_END}
      progress={progress}
      position={[1.05, FLOOR_T, 1.0]}
      lift={0.15}
    >
      {/* Seat */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.05, 0.45]} />
        <meshStandardMaterial color={OAK} roughness={0.55} />
      </mesh>
      {/* Backrest — on the side facing AWAY from the desk so the chair seats
          a sitter facing the desk top. */}
      <mesh position={[-0.2, 0.7, 0]} castShadow>
        <boxGeometry args={[0.05, 0.55, 0.42]} />
        <meshStandardMaterial color={OAK_DARK} roughness={0.55} />
      </mesh>
      {/* Cushion on seat */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <boxGeometry args={[0.42, 0.04, 0.42]} />
        <meshStandardMaterial color={"#cfb892"} roughness={0.9} />
      </mesh>
      {/* Four legs */}
      {[
        [0.2, 0.21],
        [-0.2, 0.21],
        [0.2, -0.21],
        [-0.2, -0.21],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.21, z]} castShadow>
          <boxGeometry args={[0.03, 0.42, 0.03]} />
          <meshStandardMaterial color={OAK_DARK} roughness={0.55} />
        </mesh>
      ))}
    </Piece>
  );
}

// ---------- Sheer curtains flanking the left-wall window ----------
function Curtains({ progress }: { progress: { current: number } }) {
  // Two drape panels just inside the left wall, framing the window.
  const Y_CENTER = FLOOR_T + (WALL_H - 0.1) / 2 + 0.05;
  const HEIGHT = WALL_H - 0.1;
  return (
    <Piece
      start={CURTAIN_START}
      end={CURTAIN_END}
      progress={progress}
      position={[-HALF_W + 0.08, Y_CENTER, 0]}
      lift={0.0}
    >
      {/* Curtain rod */}
      <mesh position={[0, HEIGHT / 2 + 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 1.9, 12]} />
        <meshStandardMaterial color={OAK_DARK} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Left drape (back side of window) */}
      <mesh position={[0, 0, -0.78]} castShadow>
        <boxGeometry args={[0.06, HEIGHT, 0.32]} />
        <meshStandardMaterial color={CURTAIN} roughness={0.9} />
      </mesh>
      {/* Right drape (front side of window) */}
      <mesh position={[0, 0, 0.78]} castShadow>
        <boxGeometry args={[0.06, HEIGHT, 0.32]} />
        <meshStandardMaterial color={CURTAIN} roughness={0.9} />
      </mesh>
    </Piece>
  );
}

// ---------- L-shaped low sofa at the foot of the bed ----------
function Sofa({ progress }: { progress: { current: number } }) {
  // Long seat runs along the x-axis at the foot of the bed; the short return
  // tucks toward the right side. Reads as a casual loungeable L.
  const SEAT_H = 0.22;
  const CUSHION_H = 0.18;
  const Y_BASE = FLOOR_T + SEAT_H / 2;
  const Y_CUSHION = FLOOR_T + SEAT_H + CUSHION_H / 2;
  const Y_BACK = FLOOR_T + SEAT_H + 0.32;
  return (
    <Piece
      start={SOFA_START}
      end={SOFA_END}
      progress={progress}
      position={[0, 0, 0.95]}
      lift={0.2}
    >
      {/* Long seat base */}
      <mesh position={[-0.4, Y_BASE, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, SEAT_H, 0.75]} />
        <meshStandardMaterial color={SOFA_DARK} roughness={0.9} />
      </mesh>
      {/* Long seat cushion */}
      <mesh position={[-0.4, Y_CUSHION, 0]} castShadow>
        <boxGeometry args={[2.0, CUSHION_H, 0.65]} />
        <meshStandardMaterial color={SOFA} roughness={0.95} />
      </mesh>
      {/* Long backrest */}
      <mesh position={[-0.4, Y_BACK, 0.34]} castShadow>
        <boxGeometry args={[2.0, 0.36, 0.16]} />
        <meshStandardMaterial color={SOFA} roughness={0.95} />
      </mesh>
      {/* Armrest on the far left */}
      <mesh position={[-1.42, Y_CUSHION, 0]} castShadow>
        <boxGeometry args={[0.18, 0.32, 0.7]} />
        <meshStandardMaterial color={SOFA_DARK} roughness={0.9} />
      </mesh>
      {/* Armrest on the right end (replaces the L-return so the front of the
          room stays open and the desk/chair area can read clearly). */}
      <mesh position={[0.62, Y_CUSHION, 0]} castShadow>
        <boxGeometry args={[0.18, 0.32, 0.7]} />
        <meshStandardMaterial color={SOFA_DARK} roughness={0.9} />
      </mesh>
      {/* Throw pillow on long seat */}
      <mesh
        position={[-1.05, Y_CUSHION + 0.1, -0.08]}
        rotation={[0, 0.2, 0.1]}
        castShadow
      >
        <boxGeometry args={[0.35, 0.18, 0.32]} />
        <meshStandardMaterial color={DUVET_SOFT} roughness={0.95} />
      </mesh>
    </Piece>
  );
}

// ---------- Wood-slat feature wall behind the bed ----------
// Signature element from the reference: a run of vertical oak slats with
// shadow gaps. Spans the back wall behind the bed, floor to ceiling.
function SlatWall({ progress }: { progress: { current: number } }) {
  const SLAT_W = 0.08;
  const SLAT_GAP = 0.05;
  const SLAT_D = 0.04;
  const SLAT_H = WALL_H - 0.1;
  const COUNT = 18;
  const PITCH = SLAT_W + SLAT_GAP;
  const TOTAL_W = COUNT * SLAT_W + (COUNT - 1) * SLAT_GAP;
  const startX = -TOTAL_W / 2 + SLAT_W / 2;

  // Cheap two-tone alternation gives the wall some grain variation.
  const slats = Array.from({ length: COUNT }, (_, i) => ({
    x: startX + i * PITCH,
    color: i % 3 === 0 ? OAK_LIGHT : i % 5 === 0 ? OAK_DARK : OAK,
  }));

  return (
    <Piece
      start={PAINTING_START}
      end={PAINTING_END}
      progress={progress}
      position={[0, FLOOR_T + SLAT_H / 2 + 0.05, -HALF_D + SLAT_D / 2 + 0.01]}
      lift={0.0}
    >
      {/* backing board so the gaps read as shadow lines */}
      <mesh position={[0, 0, -0.012]} receiveShadow>
        <boxGeometry args={[TOTAL_W + 0.05, SLAT_H + 0.04, 0.02]} />
        <meshStandardMaterial color={"#5a4030"} roughness={0.9} />
      </mesh>
      {slats.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[SLAT_W, SLAT_H, SLAT_D]} />
          <meshStandardMaterial color={s.color} roughness={0.6} />
        </mesh>
      ))}
    </Piece>
  );
}

// ---------- Plant (pot + foliage) ----------
function Plant({ progress }: { progress: { current: number } }) {
  return (
    <Piece
      start={PLANT_START}
      end={PLANT_END}
      progress={progress}
      position={[1.7, FLOOR_T, -0.6]}
      lift={0.2}
    >
      {/* pot */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.32, 16]} />
        <meshStandardMaterial color={POT} roughness={0.8} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.01, 16]} />
        <meshStandardMaterial color={"#3a2a1a"} roughness={0.95} />
      </mesh>
      {/* foliage — overlapping blobs */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <icosahedronGeometry args={[0.28, 1]} />
        <meshStandardMaterial color={FOLIAGE} roughness={0.85} />
      </mesh>
      <mesh position={[-0.1, 0.7, 0.05]} castShadow>
        <icosahedronGeometry args={[0.18, 1]} />
        <meshStandardMaterial color={"#3f5a30"} roughness={0.85} />
      </mesh>
      <mesh position={[0.1, 0.62, -0.08]} castShadow>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial color={"#607a48"} roughness={0.85} />
      </mesh>
      {/* a tall leaf blade */}
      <mesh position={[0.06, 0.78, 0]} rotation={[0.1, 0, -0.15]} castShadow>
        <coneGeometry args={[0.04, 0.4, 4, 1]} />
        <meshStandardMaterial color={"#4a6a36"} roughness={0.8} />
      </mesh>
    </Piece>
  );
}

// ---------- Camera rig ----------
function Rig({
  getTarget,
  pRef,
}: {
  getTarget: () => number;
  pRef: { current: number };
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.8, -0.2));

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.0015, delta);
    pRef.current = lerp(pRef.current, getTarget(), k);
    const p = pRef.current;

    // Camera stays in front of the open (positive-z) side of the diorama so
    // the right wall never blocks the view. High 3/4 plan view at p=0 →
    // composed front-right showroom view at p=1.
    const camX = lerp(2.8, 1.7, p);
    const camY = lerp(4.6, 2.05, p);
    const camZ = lerp(5.6, 4.0, p);
    camera.position.set(camX, camY, camZ);
    target.current.set(0, lerp(0.4, 0.85, p), lerp(0.0, -0.35, p));
    camera.lookAt(target.current);
  });

  return null;
}

// ---------- Main scene ----------
export default function InteriorScene({
  scroll,
  staticProgress,
}: {
  scroll?: MotionValue<number>;
  staticProgress?: number;
}) {
  const pRef = useRef(scroll ? 0 : staticProgress ?? 0);
  const getTarget = () => (scroll ? scroll.get() : staticProgress ?? 0);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 38, near: 0.1, far: 60, position: [5, 4, 5] }}
    >
      <fog attach="fog" args={["#f2efe9", 14, 32]} />

      <ambientLight intensity={0.85} />
      <hemisphereLight
        intensity={0.6}
        color={"#fff5e0"}
        groundColor={"#bea884"}
      />
      {/* Key — warm afternoon sun above-front */}
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.3}
        color={"#fff4dc"}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-radius={6}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-6, 6, 6, -6, 0.1, 24]}
        />
      </directionalLight>
      {/* Window fill — bright daylight pouring through the left wall */}
      <directionalLight
        position={[-6, 3, 0.5]}
        intensity={0.95}
        color={"#fdf3d8"}
      />
      {/* Warm bounce off the wood floor */}
      <pointLight
        position={[0, 0.9, 0.5]}
        intensity={0.35}
        distance={5}
        decay={2}
        color={"#f3d2a0"}
      />

      {/* Ground beyond the room — paper plot, fades into fog */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={"#ece6db"} roughness={0.95} />
      </mesh>

      <FloorPlan progress={pRef} />
      <RoomShell progress={pRef} />
      <Curtains progress={pRef} />
      <SlatWall progress={pRef} />
      <Rug progress={pRef} />
      <Bed progress={pRef} />
      <Sofa progress={pRef} />
      <Nightstand progress={pRef} />
      <Lamp progress={pRef} />
      <Desk progress={pRef} />
      <Chair progress={pRef} />
      <Plant progress={pRef} />

      <Rig getTarget={getTarget} pRef={pRef} />
    </Canvas>
  );
}
