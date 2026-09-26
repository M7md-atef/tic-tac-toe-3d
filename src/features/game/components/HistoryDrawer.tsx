"use client";

import React from "react";
import { Clock, History, Swords } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useSettings } from "@/features/customization/context/SettingsContext";
import { MatchRecord } from "../types/game.types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: MatchRecord[];
}

export function HistoryDrawer({ isOpen, onClose, history }: HistoryDrawerProps) {
  const { settings } = useSettings();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Match History Log"
      description="Record of recent battles and strategic encounters."
    >
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <History className="w-12 h-12 mb-3 text-slate-600 animate-pulse" />
          <p className="font-semibold text-sm">No matches logged yet</p>
          <p className="text-xs text-slate-500 mt-1">Play your first round to record stats!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((record) => {
            const isDraw = record.winner === "draw";
            const winnerColor =
              isDraw
                ? "#94a3b8"
                : record.winner === "X"
                ? settings.xColor
                : settings.oColor;

            return (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 transition-all hover:bg-slate-800/90"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg border shadow-sm"
                    style={{
                      borderColor: `${winnerColor}40`,
                      backgroundColor: `${winnerColor}15`,
                      color: winnerColor,
                    }}
                  >
                    {isDraw ? "—" : record.winner}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white capitalize">
                        {isDraw ? "Draw Match" : `${record.winner} Victory`}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {record.mode === "pve" ? `AI (${record.difficulty || "Master"})` : "Local 2P"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Swords className="w-3 h-3" />
                        {record.totalMoves} moves
                      </span>
                      {record.durationSeconds > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {record.durationSeconds}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <span className="text-xs font-mono text-slate-400">{record.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
