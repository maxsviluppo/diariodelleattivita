import React, { useState, useEffect } from "react";
import { Activity, ActivityLog } from "../types";
import { PASTEL_COLORS } from "../data";
import IconRenderer from "./IconRenderer";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit3, Trash2, Settings, Check, ChevronDown, ChevronUp, Search, X, Sparkles, SlidersHorizontal, BarChart } from "lucide-react";

interface ActivityGridProps {
  activities: Activity[];
  logs?: ActivityLog[];
  onSelectActivity: (activity: Activity) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onAddNewClick: () => void;
}

export default function ActivityGrid({
  activities,
  logs = [],
  onSelectActivity,
  onEditActivity,
  onDeleteActivity,
  onAddNewClick,
}: ActivityGridProps) {
  const [isManageMode, setIsManageMode] = useState(false);
  const [isHomeExpanded, setIsHomeExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Dynamic system layout states
  const [sortByFrequency, setSortByFrequency] = useState<boolean>(true);
  const [visibleLimitSelection, setVisibleLimitSelection] = useState<3 | 9 | "all">(3);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);

  // Calculate login frequency of each activity based on log diary history
  const activityFrequencies = React.useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((log) => {
      counts[log.activityId] = (counts[log.activityId] || 0) + 1;
    });
    return counts;
  }, [logs]);

  const filteredSortedActivities = React.useMemo(() => {
    let result = [...activities];
    if (searchQuery.trim()) {
      result = result.filter((activity) =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortByFrequency) {
      // Sort dynamically: most frequent logged activities first, then custom ones, then fallback A-Z
      return result.sort((a, b) => {
        const countA = activityFrequencies[a.id] || 0;
        const countB = activityFrequencies[b.id] || 0;
        
        if (countB !== countA) {
          return countB - countA; // Descending log frequency count
        }

        // Custom items preferred over default ones
        if (a.isCustom && !b.isCustom) return -1;
        if (!a.isCustom && b.isCustom) return 1;

        // Fallback to alphabetical
        return a.name.localeCompare(b.name, "it", { sensitivity: "base" });
      });
    } else {
      // Standard Italian alphabetical sort
      return result.sort((a, b) =>
        a.name.localeCompare(b.name, "it", { sensitivity: "base" })
      );
    }
  }, [activities, searchQuery, sortByFrequency, activityFrequencies]);

  // Determine the threshold for the home view limits
  const visibleLimit = visibleLimitSelection === "all" 
    ? filteredSortedActivities.length 
    : visibleLimitSelection;

  const hasMoreThanLimit = filteredSortedActivities.length > visibleLimit;
  
  // Show all elements when searching or set to "all", otherwise respect accordion toggling
  const displayedActivities = (isHomeExpanded || searchQuery.trim() !== "" || visibleLimitSelection === "all")
    ? filteredSortedActivities
    : filteredSortedActivities.slice(0, visibleLimit);

  // Helper to resolve classes based on color id
  const getColorClasses = (colorId: string) => {
    const config = PASTEL_COLORS.find((c) => c.id === colorId) || PASTEL_COLORS[0];
    return {
      bg: config.bg,
      text: config.text,
      border: config.border,
    };
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-[32px] p-6 border border-white/40 shadow-sm" id="activity-grid-section">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-4">
        
        {/* Title, Count and Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-sleek-text flex items-center gap-2">
              <span>Attività</span>
              <span className="text-xs bg-sleek-accent/15 text-sleek-accent font-bold px-2.5 py-0.5 rounded-full border border-sleek-accent/10">
                {activities.length}
              </span>
            </h2>
          </div>

          {/* Search Lens - Expandable and stretchable */}
          <div className="relative flex items-center">
            <motion.div
              layout
              initial={{ width: 40 }}
              animate={{ width: isSearchExpanded ? 150 : 40 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="h-10 bg-white/50 hover:bg-white/70 border border-pink-100 rounded-full flex items-center overflow-hidden shadow-2xs relative"
            >
              <button
                type="button"
                onClick={() => {
                  const transitionTo = !isSearchExpanded;
                  setIsSearchExpanded(transitionTo);
                  if (!transitionTo) {
                    setSearchQuery("");
                  }
                }}
                className="w-10 h-10 flex items-center justify-center text-sleek-text-muted hover:text-sleek-accent transition-colors shrink-0 cursor-pointer"
                title={isSearchExpanded ? "Chiudi" : "Cerca"}
                id="search-toggle-btn"
              >
                <Search className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.input
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 90 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca..."
                    className="h-full bg-transparent border-none outline-none text-xs text-sleek-text font-bold pr-6 pl-1"
                    autoFocus
                    id="search-activities-input"
                  />
                )}
              </AnimatePresence>

              {isSearchExpanded && searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 text-sleek-text-muted/65 hover:text-sleek-accent cursor-pointer"
                  id="clear-search-btn"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Action Controls Panel */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center justify-end">
          {/* Toggle Dynamic Layout System preferences */}
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className={`h-11 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              showPreferences
                ? "bg-rose-50 border-rose-200 text-sleek-accent shadow-2xs"
                : "bg-white/50 hover:bg-white border-white/60 text-sleek-text-muted hover:text-sleek-text"
            }`}
            title="Scegli quante icone mostrare e come ordinarle"
            id="preferences-toggle-btn"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Opzioni Home</span>
          </button>

          {/* Add New Activity */}
          <button
            onClick={onAddNewClick}
            className="flex items-center justify-center gap-1 bg-sleek-accent hover:bg-sleek-accent/90 text-white px-4 py-3 h-11 rounded-xl text-xs font-bold shadow-xs hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex-1 sm:flex-none"
            id="launch-add-activity-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Nuova Voce</span>
          </button>

          {/* Toggle Management Mode */}
          <button
            onClick={() => setIsManageMode(!isManageMode)}
            className={`flex items-center justify-center gap-1 px-4 py-3 h-11 rounded-xl text-xs font-bold tracking-wide hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex-1 sm:flex-none ${
              isManageMode
                ? "bg-pink-600 text-white shadow-sm border border-pink-700/20"
                : "bg-white/60 hover:bg-white text-sleek-text border border-white/60 shadow-2xs"
            }`}
            id="toggle-manage-btn"
          >
            {isManageMode ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Fine</span>
              </>
            ) : (
              <>
                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Gestisci</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Accordion preferences settings layout - highly animated */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: "auto", opacity: 1, marginBottom: 16 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="overflow-hidden bg-white/55 border border-pink-100/50 rounded-2xl p-4 text-xs space-y-3 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
              {/* Option 1: Automatic smart sorting */}
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-1 font-extrabold text-sleek-text">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>Criterio Ordinamento:</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 bg-white/50 p-1 rounded-lg border border-pink-100/30">
                  <button
                    type="button"
                    onClick={() => setSortByFrequency(true)}
                    className={`py-1.5 px-3 rounded-md font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      sortByFrequency
                        ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-3xs"
                        : "text-sleek-text-muted hover:text-sleek-text hover:bg-white/30"
                    }`}
                  >
                    <span>Automatico Intel. ⚡</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortByFrequency(false)}
                    className={`py-1.5 px-3 rounded-md font-bold text-center transition-all cursor-pointer ${
                      !sortByFrequency
                        ? "bg-white text-sleek-accent shadow-3xs border border-pink-100/40"
                        : "text-sleek-text-muted hover:text-sleek-text hover:bg-white/30"
                    }`}
                  >
                    Ordine alfabetico (A-Z)
                  </button>
                </div>
                <p className="text-[10px] text-sleek-text-muted italic px-1">
                  {sortByFrequency 
                    ? "Le attività registrate più frequentemente salgono in cima in tempo reale!" 
                    : "Le icone rimangono fissate in base all'ordine alfabetico del nome."}
                </p>
              </div>

              {/* Option 2: Default maximum view limit */}
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-1 font-extrabold text-sleek-text">
                  <BarChart className="w-3.5 h-3.5 text-pink-500" />
                  <span>Mostrate all'Avvio (Pref.):</span>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-white/50 p-1 rounded-lg border border-pink-100/30">
                  <button
                    type="button"
                    onClick={() => setVisibleLimitSelection(3)}
                    className={`py-1.5 px-1.5 rounded-md font-bold text-center transition-all text-[11px] cursor-pointer ${
                      visibleLimitSelection === 3
                        ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-3xs"
                        : "text-sleek-text-muted hover:text-sleek-text hover:bg-white/30"
                    }`}
                  >
                    Soglia 3
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleLimitSelection(9)}
                    className={`py-1.5 px-1.5 rounded-md font-bold text-center transition-all text-[11px] cursor-pointer ${
                      visibleLimitSelection === 9
                        ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-3xs"
                        : "text-sleek-text-muted hover:text-sleek-text hover:bg-white/30"
                    }`}
                  >
                    Bento 9
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleLimitSelection("all")}
                    className={`py-1.5 px-1.5 rounded-md font-bold text-center transition-all text-[11px] cursor-pointer ${
                      visibleLimitSelection === "all"
                        ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-3xs"
                        : "text-sleek-text-muted hover:text-sleek-text hover:bg-white/30"
                    }`}
                  >
                    Tutte {activities.length}
                  </button>
                </div>
                <p className="text-[10px] text-sleek-text-muted italic px-1">
                  Scegli quante icone visualizzare in home prima di mostrare il pulsante "Mostra altre".
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activities list render */}
      <motion.div 
        layout
        className="grid grid-cols-3 gap-3.5 sm:gap-4.5 max-w-md mx-auto"
        id="activities-buttons-grid"
      >
        <AnimatePresence mode="popLayout">
          {displayedActivities.map((activity) => {
            const { bg, text, border } = getColorClasses(activity.color);
            const freqCount = activityFrequencies[activity.id] || 0;

            return (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group flex flex-col items-center"
              >
                {/* Trigger Button - Apple App Store icon styled squircle */}
                <button
                  onClick={() => {
                    if (isManageMode) {
                      onEditActivity(activity);
                    } else {
                      onSelectActivity(activity);
                    }
                  }}
                  className={`w-full aspect-square rounded-[22%] sm:rounded-[22%] flex items-center justify-center border transition-all duration-300 relative focus:outline-none focus:ring-4 focus:ring-sleek-accent/20 cursor-pointer shadow-xs ${bg} ${text} ${border} ${
                    isManageMode
                      ? "hover:rotate-3 scale-95 border-sleek-accent"
                      : "hover:scale-105 hover:shadow-md active:scale-95 hover:border-sleek-accent"
                  }`}
                  title={isManageMode ? `Modifica ${activity.name}` : `Registra ${activity.name}`}
                  id={`activity-bubble-${activity.id}`}
                >
                  {/* Perfect relative asset scaling to adapt to dimensions */}
                  <IconRenderer name={activity.iconName} className="w-[50%] h-[50%] stroke-[1.5]" />
                  
                  {/* Glass highlight effect like iOS icons */}
                  <div className="absolute inset-0 rounded-[22%] bg-gradient-to-tr from-transparent via-white/5 to-white/12 pointer-events-none" />
                </button>

                {/* Name Label */}
                <span className="text-[11px] sm:text-xs font-bold text-sleek-text mt-2 text-center truncate max-w-full px-1 capitalize">
                  {activity.name}
                </span>

                {/* Frequency notification badge: floating beautifully on the squircle corners */}
                {!isManageMode && sortByFrequency && freqCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 z-10 translate-x-[20%] -translate-y-[20%]"
                  >
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-800 text-white border border-white/60 shadow-xs flex items-center justify-center min-w-5 h-5">
                      {freqCount}
                    </span>
                  </motion.div>
                )}

                {/* Quick Action Overlays in Manage Mode */}
                <AnimatePresence>
                  {isManageMode && (
                    <>
                      {/* Edit Button */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute -top-1.5 -left-1.5 z-30"
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditActivity(activity);
                          }}
                          className="w-7 h-7 bg-pink-500 hover:bg-pink-600 active:scale-90 text-white rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer border-2 border-white pointer-events-auto"
                          title="Modifica"
                          id={`edit-activity-bubble-btn-${activity.id}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>

                      {/* Delete Button */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute -top-1.5 -right-1.5 z-30"
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteActivity(activity.id);
                          }}
                          className="w-7 h-7 bg-red-500 hover:bg-red-600 active:scale-90 text-white rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer border-2 border-white pointer-events-auto"
                          title="Elimina"
                          id={`delete-activity-bubble-btn-${activity.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Accordion Toggle Button for Home Grid */}
      {hasMoreThanLimit && !searchQuery.trim() && (
        <div className="mt-6 flex justify-center border-t border-dashed border-pink-100 pt-5">
          <button
            type="button"
            onClick={() => setIsHomeExpanded(!isHomeExpanded)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-sleek-accent bg-sleek-accent/5 hover:bg-sleek-accent/10 hover:scale-[1.02] border border-pink-150/40 active:scale-95 transition-all cursor-pointer shadow-2xs"
            id="toggle-expand-home-activities-btn"
          >
            <span>{isHomeExpanded ? "Mostra meno attività" : `Mostra altre ${filteredSortedActivities.length - visibleLimit} attività`}</span>
            {isHomeExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Search No Results */}
      {searchQuery.trim() && filteredSortedActivities.length === 0 && (
        <div className="text-center py-8 text-xs text-sleek-text-muted italic">
          Nessuna attività corrisponde a "{searchQuery}"
        </div>
      )}
    </div>
  );
}
