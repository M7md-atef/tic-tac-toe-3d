export type ThemeId = "playdate" | "candy" | "gameboy" | "claycraft" | "midnightToy";

export type SymbolStyle = "modern" | "cyber" | "serif" | "pixel";

export type GlowIntensity = "none" | "subtle" | "vivid" | "neon";

export interface ColorPreset {
  id: string;
  name: string;
  hex: string;
  glowClass: string;
  textClass: string;
  borderClass: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  backgroundGradient: string;
  boardBg: string;
  boardBorder: string;
  cellBg: string;
  cellBorder: string;
  cellShadow: string;
  primaryGlow: string;
  accentColor: string;
}

export interface CustomizationSettings {
  themeId: ThemeId;
  xColor: string;
  oColor: string;
  xGlow: GlowIntensity;
  oGlow: GlowIntensity;
  symbolStyle: SymbolStyle;
  soundEnabled: boolean;
  soundVolume: number;
  tiltEnabled: boolean;
}
