"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CUSTOMIZATION, THEME_PRESETS } from "@/constants/themes";
import { CustomizationSettings, ThemeConfig } from "../types/theme.types";

interface SettingsContextValue {
  settings: CustomizationSettings;
  theme: ThemeConfig;
  updateSettings: (updates: Partial<CustomizationSettings>) => void;
  resetSettings: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const SETTINGS_STORAGE_KEY = "tictactoe-3d-customization-v1";

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

// Safe fallback theme in case of unexpected state
const FALLBACK_THEME: ThemeConfig = THEME_PRESETS.playdate || Object.values(THEME_PRESETS)[0];

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CustomizationSettings>(DEFAULT_CUSTOMIZATION);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored theme was from a previous version and no longer exists, migrate to default
        if (parsed.themeId && !THEME_PRESETS[parsed.themeId]) {
          parsed.themeId = DEFAULT_CUSTOMIZATION.themeId;
        }
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  // Save changes to localStorage
  const updateSettings = (updates: Partial<CustomizationSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore localStorage write errors
      }
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_CUSTOMIZATION);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_CUSTOMIZATION));
    } catch {
      // Ignore
    }
  };

  // Safely resolve active theme
  const activeThemeId = settings?.themeId && THEME_PRESETS[settings.themeId]
    ? settings.themeId
    : DEFAULT_CUSTOMIZATION.themeId;

  const currentTheme: ThemeConfig = THEME_PRESETS[activeThemeId] || FALLBACK_THEME;

  return (
    <SettingsContext.Provider
      value={{
        settings: isMounted ? settings : DEFAULT_CUSTOMIZATION,
        theme: currentTheme,
        updateSettings,
        resetSettings,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
