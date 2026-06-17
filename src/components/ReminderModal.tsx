import React, { useState } from "react";
import { Activity, ActivityLog } from "../types";
import { PASTEL_COLORS } from "../data";
import IconRenderer from "./IconRenderer";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, CalendarRange, CalendarCheck, Sun, Bell, X } from "lucide-react";

interface ReminderModalProps {
  activity: Activity;
  log: ActivityLog;
  onClose: () => void;
  onConfirm: (dateIso: string) => void;
}

// Solid, high-contrast brand background colors corresponding to each pastel ID
const VIBRANT_BG_COLORS: Record<string, string> = {
  rose: "bg-pink-600 hover:bg-pink-700 shadow-pink-200",
  amber: "bg-amber-600 hover:bg-amber-700 shadow-amber-250",
  emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-250",
  sky: "bg-sky-600 hover:bg-sky-700 shadow-sky-250",
  indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-250",
  violet: "bg-violet-600 hover:bg-violet-700 shadow-violet-250",
  fuchsia: "bg-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-250",
  slate: "bg-slate-700 hover:bg-slate-800 shadow-slate-250",
};

export default function ReminderModal({ activity, log, onClose, onConfirm }: ReminderModalProps) {
  const hasReminder = !!(log.reminderEnabled && log.reminderDate);
  const initialDate = hasReminder ? new Date(log.reminderDate!) : new Date();

  // Navigation month state
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);
  const [selectedDay, setSelectedDay] = useState<number>(initialDate.getDate());
  
  // Time state (Hour and Minute Picker) - default to 9:00 AM if new
  const [hours, setHours] = useState<number>(hasReminder ? initialDate.getHours() : 9);
  const [minutes, setMinutes] = useState<number>(hasReminder ? initialDate.getMinutes() : 0);

  // Calculate calendar days
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0 = January, etc.
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Shift Sunday/Monday: 0 = Mon, 1 = Tue, ..., 6 = Sun
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;
  
  const totalDays = lastDayOfMonth.getDate();
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptyWeeksPadding = Array.from({ length: startDayOfWeek });

  const italianMonths = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Quick Preset Actions
  const applyDaysPreset = (daysToAdd: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    
    setCurrentMonth(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    setSelectedDay(targetDate.getDate());
    setHours(targetDate.getHours());
    setMinutes(targetDate.getMinutes());
  };

  const applyWeeksPreset = (weeksToAdd: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + weeksToAdd * 7);
    
    setCurrentMonth(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    setSelectedDay(targetDate.getDate());
    setHours(targetDate.getHours());
    setMinutes(targetDate.getMinutes());
  };

  const applyMonthsPreset = (monthsToAdd: number) => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthsToAdd);
    
    setCurrentMonth(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    setSelectedDay(targetDate.getDate());
    setHours(targetDate.getHours());
    setMinutes(targetDate.getMinutes());
  };

  const applyTomorrowPreset = () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    
    setCurrentMonth(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    setSelectedDay(targetDate.getDate());
    // Tomorrow standard start-of-day alert (09:00)
    setHours(9);
    setMinutes(0);
  };

  // Verify chosen deadline date-time is in the future
  const scheduledDate = new Date(year, month, selectedDay, hours, minutes, 0);
  const isFuture = scheduledDate.getTime() > Date.now();

  // Submit trigger
  const handleSave = () => {
    if (!isFuture) return;
    onConfirm(scheduledDate.toISOString());
  };

  // Get color styles for this activity
  const activeColorConfig = PASTEL_COLORS.find((c) => c.id === activity.color) || PASTEL_COLORS[0];
  const activeColor = activity.color || "rose";
  const vibrantClass = VIBRANT_BG_COLORS[activeColor] || VIBRANT_BG_COLORS.rose;

  const selectedFullDate = new Date(year, month, selectedDay);
  const formattedSelectedDate = selectedFullDate.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[32px] p-5 md:p-6 w-full max-w-sm shadow-2xl border border-pink-100 flex flex-col relative"
        id="reminder-modal-container"
      >
        {/* Absolute header close X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          id="close-reminder-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic Activity Header */}
        <div className="flex items-center gap-3 mb-5 mt-1">
          <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center border shrink-0 ${activeColorConfig.bg} ${activeColorConfig.text} ${activeColorConfig.border}`}>
            <IconRenderer name={activity.iconName} className="w-6 h-6 stroke-[1.6]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 flex items-center gap-1">
              <Bell className="w-3 h-3 text-pink-500 animate-swing animate-pulse" /> Notifica & Promemoria
            </span>
            <h3 className="text-base font-black text-slate-800 tracking-tight capitalize">
              Scadenza {log.activityName}
            </h3>
          </div>
        </div>

        {/* Quick presets buttons panel */}
        <div className="mb-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
            Scadenze Rapide
          </span>
          <div className="grid grid-cols-4 gap-1.5 pb-1">
            <button
              type="button"
              onClick={() => applyDaysPreset(1)}
              className="py-2.5 px-1 bg-pink-50/50 hover:bg-pink-100/50 text-slate-700 font-extrabold text-[10px] rounded-2xl transition-all border border-pink-100/30 cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4 text-pink-500" />
              <span>1 Giorno</span>
            </button>
            <button
              type="button"
              onClick={() => applyWeeksPreset(1)}
              className="py-2.5 px-1 bg-pink-50/50 hover:bg-pink-100/50 text-slate-700 font-extrabold text-[10px] rounded-2xl transition-all border border-pink-100/30 cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <CalendarRange className="w-4 h-4 text-pink-500" />
              <span>1 Sett.</span>
            </button>
            <button
              type="button"
              onClick={() => applyMonthsPreset(1)}
              className="py-2.5 px-1 bg-pink-50/50 hover:bg-pink-100/50 text-slate-700 font-extrabold text-[10px] rounded-2xl transition-all border border-pink-100/30 cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4 text-pink-500" />
              <span>1 Mese</span>
            </button>
            <button
              type="button"
              onClick={applyTomorrowPreset}
              className="py-2.5 px-1 bg-pink-50/50 hover:bg-pink-100/50 text-slate-700 font-extrabold text-[10px] rounded-2xl transition-all border border-pink-100/30 cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <Sun className="w-4 h-4 text-pink-500" />
              <span>Domani</span>
            </button>
          </div>
        </div>

        {/* Calendario Selettore a Tema */}
        <div className="bg-pink-50/10 rounded-2xl p-3 border border-pink-100/40 mb-4 select-none" id="themed-calendar-selector">
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              {italianMonths[month]} {year}
            </h4>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg bg-white hover:bg-pink-50 border border-pink-100/45 text-pink-500 hover:text-pink-600 transition-all cursor-pointer shadow-xs"
                title="Mese precedente"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg bg-white hover:bg-pink-50 border border-pink-100/45 text-pink-500 hover:text-pink-600 transition-all cursor-pointer shadow-xs"
                title="Mese successivo"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-black text-pink-400 uppercase tracking-wider mb-1.5 font-sans">
            <span>Lu</span><span>Ma</span><span>Me</span><span>Gi</span><span>Ve</span><span>Sa</span><span>Do</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {emptyWeeksPadding.map((_, idx) => (
              <div key={`p-${idx}`} className="w-full aspect-square" />
            ))}
            {daysArray.map((day) => {
              const isaToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`w-full aspect-square flex items-center justify-center text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-pink-500 text-white shadow-md shadow-pink-100 scale-102 font-black"
                      : isaToday
                        ? "bg-pink-100 text-pink-700 hover:bg-pink-200"
                        : "bg-white hover:bg-pink-50/50 text-slate-700 border border-pink-100/15"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selettore Orario Interactvo */}
        <div className="bg-pink-50/10 rounded-2xl p-3 border border-pink-100/45 mb-4 select-none flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2 font-sans">
            Ora della Scadenza
          </span>
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-pink-400 uppercase tracking-widest mb-1 font-sans">Ore</span>
              <select
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="bg-white border border-pink-100/60 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer shadow-3xs"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-sm font-black text-slate-400 self-end mb-2">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-pink-400 uppercase tracking-widest mb-1 font-sans">Minuti</span>
              <select
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value))}
                className="bg-white border border-pink-100/60 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer shadow-3xs"
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const m = i * 5;
                  return (
                    <option key={m} value={m}>
                      {String(m).padStart(2, "0")}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Visualizzazione Semplice della Data Selezionata */}
        <div className="bg-pink-50/20 rounded-2xl p-3 border border-pink-100/30 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
              <Calendar className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block leading-tight font-sans">
                Data Selezionata
              </span>
              <span className="text-xs font-black text-slate-700 capitalize">
                {formattedSelectedDate} - {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Validation warning helper if in the past */}
        {!isFuture && (
          <p className="text-[10px] text-rose-500 font-bold mb-3 text-center animate-pulse font-sans">
            ⚠️ Scegli una data o un orario futuro per l'allarme!
          </p>
        )}

        {/* Actions Footer */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer text-center"
            id="cancel-reminder-btn"
          >
            Annulla
          </button>
          <button
            type="button"
            disabled={!isFuture}
            onClick={handleSave}
            className={`flex-1 py-3 px-4 rounded-xl text-center text-xs uppercase tracking-wider font-black transition-all ${
              isFuture
                ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white cursor-pointer shadow-md hover:shadow-lg hover:shadow-pink-100/50 active:scale-98"
                : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
            id="save-reminder-btn"
          >
            Attiva Scadenza
          </button>
        </div>
      </motion.div>
    </div>
  );
}
