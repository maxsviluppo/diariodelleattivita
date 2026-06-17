import React from "react";
import { Activity, ActivityLog } from "../types";
import { PASTEL_COLORS } from "../data";
import IconRenderer from "./IconRenderer";
import { motion } from "motion/react";
import { Bell, Clock, Check, Trash } from "lucide-react";

interface NotificationModalProps {
  log: ActivityLog;
  activity: Activity;
  onSnooze: () => void;
  onDismiss: () => void;
}

export default function NotificationModal({ log, activity, onSnooze, onDismiss }: NotificationModalProps) {
  const colorSpec = PASTEL_COLORS.find((c) => c.id === activity.color) || PASTEL_COLORS[0];

  // Format reminder date beautifully
  const formatTimeStr = (isoStr?: string) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl border-2 border-pink-100 flex flex-col relative text-center items-center"
      >
        {/* Animated ambient circles */}
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-pink-500/5 to-transparent pointer-events-none" />

        {/* Pulsating Bell Badge */}
        <div className="relative mb-5 flex items-center justify-center">
          <span className="absolute inline-flex h-20 w-20 rounded-full bg-pink-400 opacity-20 animate-ping" />
          <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border-2 ${colorSpec.bg} ${colorSpec.text} ${colorSpec.border} shadow-lg z-10`}>
            <IconRenderer name={activity.iconName} className="w-8 h-8 stroke-[1.5]" />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-rose-600 border-2 border-white rounded-full p-1.5 shadow-md flex items-center justify-center animate-bounce">
            <Bell className="w-3.5 h-3.5 text-white" />
          </span>
        </div>

        {/* Alarm Banner Title */}
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full inline-block mb-1.5 font-sans">
            Scadenza Raggiunta
          </span>
          <h3 className="text-xl font-black text-rose-650 tracking-tight capitalize">
            {log.activityName}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Pianificata per: <span className="font-extrabold text-slate-700">{formatTimeStr(log.reminderDate)}</span>
          </p>
        </div>

        {/* Description / Log Notes */}
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 w-full mb-6 text-xs text-slate-650 flex flex-col gap-1.5 text-left">
          <div>
            La scadenza impostata per questo inserimento è arrivata!
          </div>
          {log.notes && (
            <div className="border-t border-slate-200/60 pt-1.5">
              <span className="font-black text-slate-400 uppercase text-[9px] tracking-wider block font-sans">Nota dell'inserimento:</span>
              <p className="font-semibold text-slate-800 italic">"{log.notes}"</p>
            </div>
          )}
        </div>

        {/* Actions buttons stack: high focus targets */}
        <div className="flex flex-col gap-2.5 w-full">
          {/* Action 1: Record / Log Activity Now */}
          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-pink-205 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-white" />
            <span>Sì, Completata</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Action 2: Snooze +10 min */}
            <button
              type="button"
              onClick={onSnooze}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-250 font-sans"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Snooze (10m)</span>
            </button>

            {/* Action 3: Silence reminder */}
            <button
              type="button"
              onClick={onDismiss}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-red-650 hover:text-red-750 font-black text-xs transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-250 font-sans"
            >
              <Trash className="w-3.5 h-3.5 text-red-500" />
              <span>Silenzia</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
