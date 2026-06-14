import React, { useState } from "react";
import { ActivityLog } from "../types";
import IconRenderer from "./IconRenderer";
import { PRESET_ICONS, PASTEL_COLORS } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, Trash2, Edit2, Check, FileText, ArrowUpDown, X } from "lucide-react";

interface ActivityLogListProps {
  logs: ActivityLog[];
  onUpdateLog: (id: string, updatedFields: Partial<ActivityLog>) => void;
  onDeleteLog: (id: string) => void;
}

export default function ActivityLogList({
  logs,
  onUpdateLog,
  onDeleteLog,
}: ActivityLogListProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [tempDateTime, setTempDateTime] = useState("");
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>("all");

  // Handler for custom inline note changes
  const handleNoteChange = (id: string, newNote: string) => {
    onUpdateLog(id, { notes: newNote });
  };

  // Format Helper for human readable dates in Italian
  const formatItalianDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;

      const giorni = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
      const mesi = [
        "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", 
        "Lug", "Ago", "Set", "Ott", "Nov", "Dic"
      ];

      const giornoSettimana = giorni[d.getDay()];
      const giornoMese = d.getDate();
      const mese = mesi[d.getMonth()];
      const ore = String(d.getHours()).padStart(2, "0");
      const minuti = String(d.getMinutes()).padStart(2, "0");

      return `${giornoSettimana}, ${giornoMese} ${mese} - ${ore}:${minuti}`;
    } catch {
      return isoString;
    }
  };

  // Edit inline dialog trigger
  const startEditingDateTime = (log: ActivityLog) => {
    setEditingLogId(log.id);
    // Use the stored editable dateTimeStr or format it from timestamp
    if (log.dateTimeStr) {
      setTempDateTime(log.dateTimeStr);
    } else {
      const d = new Date(log.timestamp);
      const offset = d.getTimezoneOffset();
      const localStr = new Date(d.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 16);
      setTempDateTime(localStr);
    }
  };

  const saveDateTimeEdit = (id: string) => {
    if (!tempDateTime) return;
    // Parse the input datetime-local string to create an ISO timestamp
    const dateObj = new Date(tempDateTime);
    if (!isNaN(dateObj.getTime())) {
      onUpdateLog(id, {
        timestamp: dateObj.toISOString(),
        dateTimeStr: tempDateTime,
      });
    }
    setEditingLogId(null);
  };

  // Harvest unique year-month categories from actual cloud diary entries
  const availableMonths = React.useMemo(() => {
    const monthMap: Record<string, { label: string; year: number; month: number }> = {};
    
    logs.forEach((log) => {
      try {
        const d = new Date(log.timestamp);
        if (isNaN(d.getTime())) return;
        const year = d.getFullYear();
        const month = d.getMonth();
        const key = `${year}-${String(month + 1).padStart(2, "0")}`;
        
        if (!monthMap[key]) {
          const nomiMese = [
            "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
            "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
          ];
          monthMap[key] = {
            label: `${nomiMese[month]} ${year}`,
            year,
            month,
          };
        }
      } catch (e) {
        // Safe bypass
      }
    });

    // Return sorted descending (most recent months on top)
    return Object.entries(monthMap)
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [logs]);

  // Filtering: filter logs by activity name or notes (case insensitive) AND by selected month
  const filteredLogs = logs.filter((log) => {
    const query = filterQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      log.activityName.toLowerCase().includes(query) || 
      (log.notes && log.notes.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    if (selectedMonthKey !== "all") {
      try {
        const d = new Date(log.timestamp);
        if (isNaN(d.getTime())) return false;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return key === selectedMonthKey;
      } catch {
        return false;
      }
    }

    return true;
  });

  // Sorting: chronological order with the latest registered entries shown first
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-md border border-pink-50/70" id="diario-logs-section">
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-sleek-text flex items-center gap-2">
            <span>Diario delle Attività</span>
            {logs.length > 0 && (
              <span className="text-xs bg-sleek-accent/15 text-sleek-accent font-bold px-2.5 py-0.5 rounded-full border border-sleek-accent/10">
                {sortedLogs.length} {sortedLogs.length === logs.length ? "registrate" : `di ${logs.length}`}
              </span>
            )}
          </h2>
          <p className="text-xs text-sleek-text-muted mt-0.5">
            Traccia le tue note mentali, l'orario preciso e gestisci lo storico delle attività.
          </p>
        </div>

        {/* Search & Select dropdown filter block if logs exist */}
        {logs.length > 0 && (() => {
          const uniqueActivities = Array.from(new Set(logs.map((log) => log.activityName))).filter(Boolean).sort();
          return (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Autocomplete Input with suggestions dropdown */}
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-sleek-accent absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cerca attività o note..."
                  value={filterQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setFilterQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  className="w-full pl-9 pr-8 py-2 text-base sm:text-xs rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-sleek-accent bg-white/70 text-sleek-text font-semibold placeholder-pink-700/35 transition-all"
                  id="search-filter-input"
                />
                {filterQuery && (
                  <button
                    onClick={() => {
                      setFilterQuery("");
                      setIsDropdownOpen(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sleek-text-muted hover:text-sleek-accent cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Styled Autocomplete Suggestion Dropdown (Sezione autocomposizione) */}
                {isDropdownOpen && uniqueActivities.length > 0 && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)} 
                    />
                    <div className="absolute left-0 right-0 mt-1.5 max-h-48 overflow-y-auto bg-white border border-pink-100 rounded-xl shadow-lg z-20 divide-y divide-pink-50/50">
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-sleek-text-muted bg-pink-50/40">
                        Attività registrate:
                      </div>
                      {uniqueActivities
                        .filter((act) =>
                          !filterQuery || act.toLowerCase().includes(filterQuery.toLowerCase())
                        )
                        .map((act) => (
                          <button
                            key={act}
                            onClick={() => {
                              setFilterQuery(act);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-bold text-sleek-text hover:bg-pink-50/70 hover:text-sleek-accent transition-all cursor-pointer flex items-center gap-2"
                          >
                            <span className="text-pink-400">⚡</span>
                            <span>{act}</span>
                          </button>
                        ))}
                      {uniqueActivities.filter((act) =>
                        act.toLowerCase().includes(filterQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="px-3 py-2 text-xs text-sleek-text-muted italic">
                          Nessuna corrispondenza trovata
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Dynamic Month Selection Nav pills bar for rapid month-based routing */}
      {logs.length > 0 && availableMonths.length > 0 && (
        <div className="mb-6 pb-4 border-b border-dashed border-pink-100/50 flex flex-col gap-2 font-medium" id="month-navigation-filter-ribbon">
          <div className="text-[10px] font-black uppercase tracking-widest text-sleek-text-muted flex items-center gap-1.5 pl-1">
            <span className="w-1 h-1 rounded-full bg-sleek-accent" />
            <span>Filtra cronologia per mese:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none snap-x select-none">
            <button
              type="button"
              onClick={() => setSelectedMonthKey("all")}
              className={`px-4 py-2 rounded-full text-xs font-black shrink-0 transition-all snap-start cursor-pointer border ${
                selectedMonthKey === "all"
                  ? "bg-gradient-to-r from-pink-500 to-rose-450 text-white shadow-2xs border-transparent"
                  : "bg-pink-50/30 border-pink-100/30 text-rose-800 hover:text-rose-950 hover:bg-pink-50/75"
              }`}
            >
              Tutti i mesi ({logs.length})
            </button>

            {availableMonths.map((m) => {
              const count = logs.filter(l => {
                try {
                  const d = new Date(l.timestamp);
                  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                  return key === m.key;
                } catch {
                  return false;
                }
              }).length;

              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setSelectedMonthKey(m.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all snap-start cursor-pointer border ${
                    selectedMonthKey === m.key
                      ? "bg-gradient-to-r from-pink-500 to-rose-450 text-white shadow-2xs border-transparent"
                      : "bg-pink-50/40 border-pink-100/30 text-slate-700 hover:text-slate-900 hover:bg-pink-50"
                  }`}
                >
                  {m.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-[32px] bg-sleek-light/40 border border-dashed border-pink-200">
          <div className="w-12 h-12 rounded-full bg-sleek-light flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-sleek-accent stroke-[1.5]" />
          </div>
          <h4 className="text-sm font-bold text-sleek-text">Nessuna attività registrata</h4>
          <p className="text-xs text-sleek-text-muted mt-1 max-w-xs mx-auto">
            Clicca su una delle icone colorate nel pannello in alto per iniziare a tracciare la tua giornata!
          </p>
        </div>
      ) : sortedLogs.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-[32px] bg-sleek-light/30 text-sleek-text-muted text-xs font-semibold border border-dashed border-pink-100">
          Nessun risultato corrisponde al filtro "{filterQuery}"
          <button
            onClick={() => setFilterQuery("")}
            className="block mx-auto mt-2 text-sleek-accent hover:underline font-bold"
          >
            Azzera filtro di ricerca
          </button>
        </div>
      ) : (
        <div className="w-full">
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto rounded-[32px] border border-pink-100 bg-white shadow-xs">
            <table className="w-full text-left border-collapse" id="logs-tabular-table">
              <thead>
                <tr className="bg-pink-50/20 border-b border-pink-100/60 text-sleek-accent text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                  <th className="py-3 px-2 w-12 text-center">Icona</th>
                  <th className="py-3 px-2 md:w-48 text-left">Attività</th>
                  <th className="py-3 px-2 md:w-60 text-left">Data e Ora</th>
                  <th className="py-3 px-2 min-w-[120px] text-left">Note</th>
                  <th className="py-3 px-2 w-16 sm:w-24 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {(() => {
                    let lastMonth = "";
                    return sortedLogs.map((log) => {
                      const isEditingTime = editingLogId === log.id;
                      const colorConfig = PASTEL_COLORS.find((c) => c.id === log.color) || PASTEL_COLORS[0];

                      // Parse year-month label for visual grouping separators
                      let currentMonthLabel = "";
                      let currentMonthKey = "";
                      try {
                        const d = new Date(log.timestamp);
                        if (!isNaN(d.getTime())) {
                          const year = d.getFullYear();
                          const month = d.getMonth();
                          currentMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
                          const nomiMese = [
                            "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
                            "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
                          ];
                          currentMonthLabel = `${nomiMese[month]} ${year}`;
                        }
                      } catch {
                        // Safe ignore
                      }

                      const isNewMonth = currentMonthKey && currentMonthKey !== lastMonth;
                      if (currentMonthKey) {
                        lastMonth = currentMonthKey;
                      }

                      return (
                        <React.Fragment key={log.id}>
                          {isNewMonth && (
                            <tr className="bg-pink-50/15" id={`month-sep-row-${currentMonthKey}`}>
                              <td colSpan={5} className="py-2.5 px-4 text-[10px] font-black uppercase tracking-widest text-pink-700 bg-gradient-to-r from-pink-50/50 to-rose-50/5 border-y border-pink-100/40">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                                  <span>{currentMonthLabel}</span>
                                </div>
                              </td>
                            </tr>
                          )}
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="border-b border-pink-50 hover:bg-pink-50/20 transition-colors group align-middle"
                          >
                            {/* Icon */}
                            <td className="py-2.5 px-2 cursor-pointer" onClick={() => startEditingDateTime(log)}>
                              <div className="flex justify-center">
                                <div
                                  className={`w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center border ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}
                                >
                                  <IconRenderer name={log.iconName} className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 stroke-[1.5]" />
                                </div>
                              </div>
                            </td>

                            {/* Event Name */}
                            <td className="py-2.5 px-2">
                              <span className="font-extrabold text-sleek-text text-[11px] sm:text-sm capitalize block">
                                {log.activityName}
                              </span>
                            </td>

                            {/* Date & Time */}
                            <td className="py-2.5 px-2 text-xs">
                              {isEditingTime ? (
                                <div className="flex items-center gap-1 min-w-[170px]">
                                  <input
                                    type="datetime-local"
                                    value={tempDateTime}
                                    onChange={(e) => setTempDateTime(e.target.value)}
                                    className="px-1.5 py-1 rounded-lg border border-pink-200 text-base sm:text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sleek-accent bg-white text-sleek-text"
                                    id={`datetime-input-${log.id}`}
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => saveDateTimeEdit(log.id)}
                                      className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                                      title="Salva Data"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setEditingLogId(null)}
                                      className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors cursor-pointer"
                                      title="Annulla"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-sleek-text-muted font-bold">
                                  <span 
                                    onClick={() => startEditingDateTime(log)}
                                    className="hover:text-sleek-accent cursor-pointer transition-colors border-b border-dashed border-pink-200 hover:border-sleek-accent pb-0.5 inline-block text-xs font-bold"
                                    title="Clicca per modificare data/ora"
                                    id={`display-time-${log.id}`}
                                  >
                                    {formatItalianDate(log.timestamp)}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Note Field (Direct Inline Input) */}
                            <td className="py-2.5 px-2">
                              <div className="relative flex items-center">
                                <FileText className="w-3.5 h-3.5 text-pink-300 absolute left-2 pointer-events-none group-hover:text-sleek-accent transition-colors" />
                                <input
                                  type="text"
                                  value={log.notes}
                                  onChange={(e) => handleNoteChange(log.id, e.target.value)}
                                  placeholder="Aggiungi una nota..."
                                  className="w-full pl-7 pr-2 py-1.5 text-base sm:text-xs font-bold rounded-lg bg-transparent border border-transparent hover:border-pink-200 focus:border-sleek-accent/40 hover:bg-white/40 focus:bg-white focus:outline-none text-sleek-text placeholder-pink-700/35 focus:ring-1 focus:ring-pink-100 transition-all"
                                  id={`notes-input-${log.id}`}
                                />
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-2 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {/* Edit Date toggle */}
                                <button
                                  onClick={() => startEditingDateTime(log)}
                                  className="p-1 px-1.5 text-sleek-text-muted hover:text-sleek-accent hover:bg-sleek-light rounded-lg transition-all cursor-pointer"
                                  title="Modifica Data/Ora"
                                  id={`edit-log-btn-${log.id}`}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Log row */}
                                <button
                                  onClick={() => onDeleteLog(log.id)}
                                  className="p-1 px-1.5 text-sleek-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                  title="Cancella Registrazione"
                                  id={`delete-log-btn-${log.id}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        </React.Fragment>
                      );
                    });
                  })()}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile non-scrolling 2-line clean item layout */}
          <div className="block sm:hidden space-y-3" id="logs-mobile-list">
            <AnimatePresence initial={false}>
              {(() => {
                let lastMonthMobile = "";
                return sortedLogs.map((log) => {
                  const isEditingTime = editingLogId === log.id;
                  const colorConfig = PASTEL_COLORS.find((c) => c.id === log.color) || PASTEL_COLORS[0];

                  // Parse year-month label for visual grouping separators
                  let currentMonthLabel = "";
                  let currentMonthKey = "";
                  try {
                    const d = new Date(log.timestamp);
                    if (!isNaN(d.getTime())) {
                      const year = d.getFullYear();
                      const month = d.getMonth();
                      currentMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
                      const nomiMese = [
                        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
                        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
                      ];
                      currentMonthLabel = `${nomiMese[month]} ${year}`;
                    }
                  } catch {
                    // Safe ignore
                  }

                  const isNewMonth = currentMonthKey && currentMonthKey !== lastMonthMobile;
                  if (currentMonthKey) {
                    lastMonthMobile = currentMonthKey;
                  }

                  return (
                    <React.Fragment key={log.id}>
                      {isNewMonth && (
                        <div className="py-2.5 px-3 mt-4 mb-2 first:mt-0 text-[10px] font-black uppercase tracking-widest text-pink-700 bg-pink-100/30 rounded-xl border border-pink-200/20 flex items-center gap-2" id={`mobile-month-divider-${currentMonthKey}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                          <span>{currentMonthLabel}</span>
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white/80 border border-pink-100/65 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
                      >
                        {/* Row 1: Left (Icon & Name) / Right (Actions) */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}
                            >
                              <IconRenderer name={log.iconName} className="w-4.5 h-4.5 stroke-[1.5]" />
                            </div>
                            <span className="font-extrabold text-sleek-text text-sm capitalize truncate max-w-[155px]">
                              {log.activityName}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => startEditingDateTime(log)}
                              className="p-1.5 text-sleek-text-muted hover:text-sleek-accent hover:bg-sleek-light rounded-lg transition-all cursor-pointer"
                              title="Modifica"
                              id={`mobile-edit-btn-${log.id}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteLog(log.id)}
                              className="p-1.5 text-sleek-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Cancella"
                              id={`mobile-delete-btn-${log.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Row 2: Left (Orario) / Right (Note) */}
                        <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-pink-50/60 font-medium font-sans">
                          {/* Date selection or visualization */}
                          <div className="text-[11px] shrink-0">
                            {isEditingTime ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="datetime-local"
                                  value={tempDateTime}
                                  onChange={(e) => setTempDateTime(e.target.value)}
                                  className="px-1.5 py-1 rounded-md border border-pink-200 text-base sm:text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-sleek-accent bg-white text-sleek-text max-w-[130px] sm:max-w-[110px]"
                                  id={`mobile-datetime-input-${log.id}`}
                                />
                                <div className="flex gap-0.5">
                                  <button
                                    onClick={() => saveDateTimeEdit(log.id)}
                                    className="p-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md transition-colors cursor-pointer"
                                    title="Salva"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setEditingLogId(null)}
                                    className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-md transition-colors cursor-pointer"
                                    title="Annulla"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span 
                                onClick={() => startEditingDateTime(log)}
                                className="text-sleek-text-muted font-bold hover:text-sleek-accent cursor-pointer transition-colors border-b border-dashed border-pink-200 hover:border-sleek-accent leading-none inline-block text-[11px]"
                                title="Modifica Orario"
                                id={`mobile-display-time-${log.id}`}
                              >
                                {formatItalianDate(log.timestamp)}
                              </span>
                            )}
                          </div>

                          {/* Notes field */}
                          <div className="flex-1 max-w-[55%]">
                            <input
                              type="text"
                              value={log.notes}
                              onChange={(e) => handleNoteChange(log.id, e.target.value)}
                              placeholder="Nota..."
                              className="w-full px-2 py-1 text-base sm:text-xs font-bold rounded-lg bg-pink-50/15 border border-pink-100/50 hover:border-pink-200 focus:border-sleek-accent/40 focus:bg-white focus:outline-none text-right text-sleek-text placeholder-pink-700/30 transition-all"
                              id={`mobile-notes-input-${log.id}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                });
              })()}
            </AnimatePresence>
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-between items-center text-xs text-sleek-text-muted px-1 gap-2">
          <span>
            Mostrati <strong className="text-sleek-text">{sortedLogs.length}</strong> di <strong className="text-sleek-text">{logs.length}</strong> record.
          </span>
          {filterQuery && (
            <button
              onClick={() => setFilterQuery("")}
              className="text-sleek-accent hover:text-sleek-accent/80 font-bold transition-all cursor-pointer"
            >
              Cancella filtri di ricerca
            </button>
          )}
        </div>
      )}
    </div>
  );
}
