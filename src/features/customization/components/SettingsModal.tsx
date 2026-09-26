"use client";

import React from "react";
import { Check, Palette, Sparkles, Volume2, VolumeX } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { COLOR_PRESETS, THEME_PRESETS } from "@/constants/themes";
import { useSettings } from "../context/SettingsContext";
import { ThemeId } from "../types/theme.types";

export function SettingsModal() {
  const { settings, updateSettings, resetSettings, isSettingsOpen, setIsSettingsOpen } =
    useSettings();

  return (
    <Modal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      title="Toy Studio Customizer"
      description="Personalize the tactile toy chassis, token materials, and mechanical sounds."
    >
      {/* 1. Theme Presets */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-200">
          <Palette className="w-4 h-4 text-amber-400" />
          <span>Console Hardware Shell</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.values(THEME_PRESETS).map((preset) => {
            const isSelected = settings.themeId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => updateSettings({ themeId: preset.id as ThemeId })}
                className={`relative flex flex-col items-start p-3 rounded-2xl border-2 text-start transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-400/20 border-amber-400 shadow-[0_4px_0_0_#d97706]"
                    : "bg-stone-800/80 border-stone-700 hover:bg-stone-800"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 end-2.5 flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-black">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <span className="text-xs font-black text-white">{preset.name}</span>
                <span className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. X Token Customization */}
      <div className="space-y-2.5 pt-3 border-t border-stone-800">
        <label className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-stone-200">
          <span className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-md font-black text-white text-xs"
              style={{ backgroundColor: settings.xColor }}
            >
              X
            </span>
            <span>Player 1 (X) Token Color</span>
          </span>
        </label>

        {/* Color Palette Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => updateSettings({ xColor: preset.hex })}
              aria-label={`Select ${preset.name}`}
              className="relative w-9 h-9 rounded-2xl border-2 transition-transform duration-150 hover:scale-110 shadow-md cursor-pointer"
              style={{
                backgroundColor: preset.hex,
                borderColor: settings.xColor === preset.hex ? "#ffffff" : "transparent",
              }}
            >
              {settings.xColor === preset.hex && (
                <Check className="w-4 h-4 text-white mx-auto drop-shadow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. O Token Customization */}
      <div className="space-y-2.5 pt-3 border-t border-stone-800">
        <label className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-stone-200">
          <span className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full font-black text-white text-xs"
              style={{ backgroundColor: settings.oColor }}
            >
              O
            </span>
            <span>Player 2 / Robot (O) Token Color</span>
          </span>
        </label>

        {/* Color Palette Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => updateSettings({ oColor: preset.hex })}
              aria-label={`Select ${preset.name}`}
              className="relative w-9 h-9 rounded-2xl border-2 transition-transform duration-150 hover:scale-110 shadow-md cursor-pointer"
              style={{
                backgroundColor: preset.hex,
                borderColor: settings.oColor === preset.hex ? "#ffffff" : "transparent",
              }}
            >
              {settings.oColor === preset.hex && (
                <Check className="w-4 h-4 text-white mx-auto drop-shadow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Hardware Settings */}
      <div className="space-y-3 pt-3 border-t border-stone-800">
        {/* Tactile Audio Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-stone-500" />
            )}
            <div>
              <p className="text-xs font-black text-white">Mechanical Keyboard & Toy Clicks</p>
              <p className="text-[11px] text-stone-400">Tactile switch sounds synthesized via Web Audio</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-7 flex items-center rounded-full p-1 border-2 border-stone-900 transition-colors cursor-pointer ${
              settings.soundEnabled ? "bg-emerald-500 justify-end" : "bg-stone-700 justify-start"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md transform" />
          </button>
        </div>

        {/* 3D Tilt Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-xs font-black text-white">Physical 3D Console Tilt</p>
              <p className="text-[11px] text-stone-400">Dynamic perspective tracking your cursor</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ tiltEnabled: !settings.tiltEnabled })}
            className={`w-12 h-7 flex items-center rounded-full p-1 border-2 border-stone-900 transition-colors cursor-pointer ${
              settings.tiltEnabled ? "bg-amber-400 justify-end" : "bg-stone-700 justify-start"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md transform" />
          </button>
        </div>
      </div>

      {/* Reset Defaults */}
      <div className="pt-3 border-t border-stone-800 flex justify-end">
        <button
          type="button"
          onClick={resetSettings}
          className="px-3.5 py-1.5 text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
        >
          Reset to Factory Defaults
        </button>
      </div>
    </Modal>
  );
}
