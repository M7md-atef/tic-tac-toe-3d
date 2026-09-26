"use client";

import React from "react";
import { Keyboard, Volume2, VolumeX } from "lucide-react";
import { useSettings } from "@/features/customization/context/SettingsContext";

export function Footer() {
  const { settings, updateSettings } = useSettings();

  return (
    <footer className="w-full max-w-2xl mx-auto py-5 px-4 mt-auto border-t border-black/10 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400 font-semibold">
      {/* Keyboard Shortcuts Hint */}
      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
        <Keyboard className="w-4 h-4 opacity-60" />
        <span className="opacity-75">Hotkeys:</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-mono text-[10px] font-bold shadow-sm">
            R
          </kbd>
          <span>Restart</span>
        </span>
        <span className="flex items-center gap-1 ms-2">
          <kbd className="px-1.5 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-mono text-[10px] font-bold shadow-sm">
            U
          </kbd>
          <span>Undo</span>
        </span>
        <span className="flex items-center gap-1 ms-2">
          <kbd className="px-1.5 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-mono text-[10px] font-bold shadow-sm">
            S
          </kbd>
          <span>Customize</span>
        </span>
      </div>

      {/* Quick Sound Mute Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer shadow-sm active:translate-y-0.5"
        >
          {settings.soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>SFX On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
              <span>SFX Muted</span>
            </>
          )}
        </button>

        <span className="text-[11px] opacity-60">
          Handcrafted Tactile Console
        </span>
      </div>
    </footer>
  );
}
