/**
 * Tower geometry — shared between the WebGL scene (Building/HeroScene) and the
 * DOM overlay (Hero readout). Kept free of `three` imports so the Hero section
 * can read FLOORS without dragging WebGL into the main page bundle.
 */
export const FLOORS = 8;
export const PODIUM_H = 0.34;
export const FLOOR_H = 0.62;
export const PLATE_W = 3.2;
export const PLATE_D = 2.2;
export const PLATE_T = 0.1;
export const COL = 0.12; // column cross-section
export const TOTAL_H = PODIUM_H + FLOORS * FLOOR_H;

export const PAPER = "#f1ede4";
export const STONE = "#e4ddd0";
export const ACCENT = "#e8771a";
