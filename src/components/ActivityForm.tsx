import React, { useState, useEffect } from "react";
import { Activity } from "../types";
import { PRESET_ICONS, PASTEL_COLORS, ICON_TRANSLATIONS } from "../data";
import IconRenderer from "./IconRenderer";
import { motion } from "motion/react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface ActivityFormProps {
  activityToEdit?: Activity | null;
  onSave: (name: string, iconName: string, color: string) => void;
  onClose: () => void;
}

export default function ActivityForm({
  activityToEdit,
  onSave,
  onClose,
}: ActivityFormProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Smile");
  const [selectedColor, setSelectedColor] = useState("rose");
  const [iconSearchQuery, setIconSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "summer" | "dance" | "general" | "faces" | "kids" | "babies" | "travel" | "transit">("all");

  useEffect(() => {
    if (activityToEdit) {
      setName(activityToEdit.name);
      setSelectedIcon(activityToEdit.iconName);
      setSelectedColor(activityToEdit.color);
      setIconSearchQuery("");
      setSelectedCategory("all");
    } else {
      setName("");
      setSelectedIcon("Smile");
      setSelectedColor("rose");
      setIconSearchQuery("");
      setSelectedCategory("all");
    }
  }, [activityToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), selectedIcon, selectedColor);
    onClose();
  };

  const currentColorConfig = PASTEL_COLORS.find((c) => c.id === selectedColor) || PASTEL_COLORS[0];

  const filteredIcons = PRESET_ICONS.filter((icon) => {
    const translatedName = ICON_TRANSLATIONS[icon.name] || "";
    const matchesSearch =
      icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
      icon.label.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
      translatedName.toLowerCase().includes(iconSearchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [isIconsExpanded, setIsIconsExpanded] = useState(false);

  // Auto-expand icons section only when actively searching
  useEffect(() => {
    if (iconSearchQuery) {
      setIsIconsExpanded(true);
    }
  }, [iconSearchQuery]);

  return (
    <div className="fixed inset-0 bg-black/32 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 md:p-8 w-full max-w-lg shadow-xl border border-pink-100 max-h-[90vh] overflow-y-auto"
        id="activity-form-container"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-sleek-text tracking-tight" id="form-title">
            {activityToEdit ? "Modifica Attività" : "Nuova Attività"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sleek-light text-sleek-text-muted hover:text-sleek-accent transition-colors cursor-pointer"
            id="close-form-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview Bubble */}
          <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-sleek-light/40 border border-pink-100 mb-2">
            <span className="text-[10px] text-sleek-text-muted font-bold tracking-widest uppercase mb-2">Anteprima</span>
            <div
              className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-300 border ${currentColorConfig.bg} ${currentColorConfig.text} ${currentColorConfig.border} shadow-sm`}
            >
              <IconRenderer name={selectedIcon} className="w-7 h-7 stroke-[1.5]" />
            </div>
            <span className="mt-2 text-sm font-bold text-sleek-text capitalize">
              {name || "Nome Attività"}
            </span>
          </div>

          <div>
            <label className="block text-sm font-bold text-sleek-text-muted mb-2" id="label-nome">
              Nome Attività
            </label>
            <input
              type="text"
              required
              placeholder="Es. Yoga, Spesa, Birra con amici..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 text-base rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-sleek-accent bg-white text-sleek-text transition-all font-bold placeholder-pink-700/30"
              id="input-activity-name"
              maxLength={25}
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-bold text-sleek-text-muted mb-2">
              Seleziona Colore Pastello
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {PASTEL_COLORS.map((color) => {
                const isActive = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className={`h-9 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
                      color.bg
                    } ${color.text} ${
                      isActive
                        ? "border-sleek-text ring-2 ring-sleek-accent/20 scale-105 shadow-xs font-bold"
                        : "border-pink-100/50 hover:scale-[1.02] hover:border-pink-200"
                    }`}
                    title={color.name}
                    id={`color-btn-${color.id}`}
                  >
                    <span className="text-[11px] font-bold">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <label className="block text-sm font-bold text-sleek-text-muted">
                Seleziona Icona ({filteredIcons.length})
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cerca icona (es. cuore)..."
                  value={iconSearchQuery}
                  onChange={(e) => setIconSearchQuery(e.target.value)}
                  className="w-full sm:w-52 px-3 py-1.5 text-base sm:text-xs font-semibold rounded-xl border border-pink-150 focus:outline-none focus:ring-2 focus:ring-sleek-accent/40 bg-white text-sleek-text placeholder-pink-700/30 transition-all shadow-xs"
                  id="icon-search-input"
                />
                {iconSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setIconSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sleek-text-muted hover:text-sleek-accent text-[11px] font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            {/* Group Filter Tabs (Tutte, Estate ☀️, Ballo 💃, Generali) */}
            <div className="flex gap-1 p-0.5 bg-pink-100/30 border border-pink-100/50 rounded-xl mb-3 text-[10px] font-bold overflow-x-auto whitespace-nowrap scrollbar-none" id="icon-category-tabs">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setIsIconsExpanded(false);
                }}
                className={`py-1.5 px-3 rounded-lg flex-1 text-center transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-white text-pink-700 shadow-xs border border-pink-200/40"
                    : "text-pink-900/60 hover:text-pink-700 hover:bg-white/40"
                }`}
              >
                Tutte
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("summer");
                  setIsIconsExpanded(true); // Auto-expand for summer icons selection
                }}
                className={`py-1.5 px-3 rounded-lg flex-1 text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedCategory === "summer"
                    ? "bg-emerald-500 text-white shadow-xs border border-emerald-600/20"
                    : "text-emerald-700/80 hover:text-emerald-700 hover:bg-emerald-50/55"
                }`}
              >
                <span>Estate ☀️</span>
                <span className={`px-1 rounded-md text-[8px] font-mono ${
                  selectedCategory === "summer" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                }`}>50</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("dance");
                  setIsIconsExpanded(true); // Auto-expand for dance icons selection
                }}
                className={`py-1.5 px-3 rounded-lg flex-1 text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedCategory === "dance"
                    ? "bg-pink-500 text-white shadow-xs border border-pink-600/20"
                    : "text-pink-700/80 hover:text-pink-600 hover:bg-pink-50/55"
                }`}
              >
                <span>Ballo 💃</span>
                <span className={`px-1 rounded-md text-[8px] font-mono ${
                  selectedCategory === "dance" ? "bg-white/20 text-white" : "bg-pink-100 text-pink-800"
                }`}>20</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("faces");
                  setIsIconsExpanded(true); // Auto-expand for faces selection
                }}
                className={`py-1.5 px-3 rounded-lg flex-1 text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedCategory === "faces"
                    ? "bg-amber-500 text-white shadow-xs border border-amber-600/20"
                    : "text-amber-700/80 hover:text-amber-700 hover:bg-amber-50/55"
                }`}
              >
                <span>Faccine 😄</span>
                <span className={`px-1 rounded-md text-[8px] font-mono ${
                  selectedCategory === "faces" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
                }`}>50</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("kids");
                  setIsIconsExpanded(true); // Auto-expand for kids selection
                }}
                className={`py-1.5 px-3 rounded-lg flex-1 text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedCategory === "kids"
                    ? "bg-sky-500 text-white shadow-xs border border-sky-600/20"
                    : "text-sky-700/80 hover:text-sky-700 hover:bg-sky-50/55"
                }`}
              >
                <span>Bimbi 👶</span>
                <span className={`px-1 rounded-md text-[8px] font-mono ${
                  selectedCategory === "kids" ? "bg-white/20 text-white" : "bg-sky-100 text-sky-800"
                }`}>10</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("babies");
                  setIsIconsExpanded(true); // Auto-expand for babies selection
                }}
                className={`py-1.5 px-3 rounded-lg flex-1 text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedCategory === "babies"
                    ? "bg-violet-500 text-white shadow-xs border border-violet-600/20"
                    : "text-violet-700/80 hover:text-violet-700 hover:bg-violet-50/55"
                }`}
              >
                <span>Bebè 🍼</span>
                <span className={`px-1 rounded-md text-[8px] font-mono ${
                  selectedCategory === "babies" ? "bg-white/20 text-white" : "bg-violet-100 text-violet-800"
                }`}>21</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("travel");
                  setIsIconsExpanded(true); // Auto-expand for travel selection
                }}
                className={`py-1.5 px-3 rounded-lg flex-1 text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedCategory === "travel"
                    ? "bg-rose-500 text-white shadow-xs border border-rose-600/20"
                    : "text-rose-700/80 hover:text-rose-700 hover:bg-rose-50/55"
                }`}
              >
                <span>Viaggi ✈️</span>
                <span className={`px-1 rounded-md text-[8px] font-mono ${
                  selectedCategory === "travel" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-800"
                }`}>20</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("transit");
                  setIsIconsExpanded(true); // Auto-expand for transit selection
                }}
                className={`py-1.5 px-3 rounded-lg flex-1 text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedCategory === "transit"
                    ? "bg-sky-500 text-white shadow-xs border border-sky-600/20"
                    : "text-sky-700/80 hover:text-sky-700 hover:bg-sky-50/55"
                }`}
              >
                <span>Trasporti 🚲</span>
                <span className={`px-1 rounded-md text-[8px] font-mono ${
                  selectedCategory === "transit" ? "bg-white/20 text-white" : "bg-sky-100 text-sky-800"
                }`}>10</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("general");
                  setIsIconsExpanded(false);
                }}
                className={`py-1.5 px-3 rounded-lg flex-1 text-center transition-all cursor-pointer ${
                  selectedCategory === "general"
                    ? "bg-white text-pink-700 shadow-xs border border-pink-200/40"
                    : "text-pink-900/60 hover:text-pink-700 hover:bg-white/40"
                }`}
              >
                Generali
              </button>
            </div>
            <div className="border border-pink-100 rounded-2xl bg-white/50 p-2 shadow-xs">
              {/* First 2 rows (10 icons) */}
              <div className="grid grid-cols-5 gap-2.5">
                {filteredIcons.slice(0, 10).map((icon) => {
                  const isSelected = selectedIcon === icon.name;
                  return (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => setSelectedIcon(icon.name)}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-sleek-accent/15 text-sleek-accent font-bold ring-1 ring-sleek-accent/30"
                          : "hover:bg-sleek-light/40 text-sleek-text-muted hover:text-sleek-accent"
                      }`}
                      title={icon.label}
                      id={`icon-select-${icon.name}`}
                    >
                      <IconRenderer name={icon.name} className="w-5.5 h-5.5 stroke-[1.5]" />
                      <span className="text-[8px] mt-1 text-center truncate w-full text-sleek-text-muted/70 font-bold" title={ICON_TRANSLATIONS[icon.name] || icon.name}>
                        {ICON_TRANSLATIONS[icon.name] || icon.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Accordion / Collapsible section */}
              {filteredIcons.length > 10 && (
                <div className="mt-2.5 pt-2.5 border-t border-pink-100/50">
                  <button
                    type="button"
                    onClick={() => setIsIconsExpanded(!isIconsExpanded)}
                    className="w-full py-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-sleek-accent bg-sleek-accent/5 hover:bg-sleek-accent/10 rounded-xl transition-all cursor-pointer border border-pink-150/40"
                    id="toggle-expand-icons-btn"
                  >
                    <span>{isIconsExpanded ? "Mostra meno icone" : `Mostra altre ${filteredIcons.length - 10} icone`}</span>
                    {isIconsExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isIconsExpanded ? "auto" : 0,
                      opacity: isIconsExpanded ? 1 : 0,
                      marginTop: isIconsExpanded ? 10 : 0,
                    }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-5 gap-2.5 max-h-48 overflow-y-auto pr-1">
                      {filteredIcons.slice(10).map((icon) => {
                        const isSelected = selectedIcon === icon.name;
                        return (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() => setSelectedIcon(icon.name)}
                            className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-sleek-accent/15 text-sleek-accent font-bold ring-1 ring-sleek-accent/30"
                                : "hover:bg-sleek-light/40 text-sleek-text-muted hover:text-sleek-accent"
                            }`}
                            title={icon.label}
                            id={`icon-select-${icon.name}`}
                          >
                            <IconRenderer name={icon.name} className="w-5.5 h-5.5 stroke-[1.5]" />
                            <span className="text-[8px] mt-1 text-center truncate w-full text-sleek-text-muted/70 font-bold" title={ICON_TRANSLATIONS[icon.name] || icon.name}>
                              {ICON_TRANSLATIONS[icon.name] || icon.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              )}

              {filteredIcons.length === 0 && (
                <div className="py-6 text-center text-xs text-sleek-text-muted italic">
                  Nessun'icona trovata per "{iconSearchQuery}"
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-pink-100/40 hover:bg-pink-100/70 text-sleek-text font-bold transition-all cursor-pointer text-center"
              id="cancel-form-btn"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-sleek-accent hover:bg-sleek-accent/90 text-white font-bold shadow-md shadow-pink-100 hover:shadow-lg transition-all cursor-pointer text-center"
              id="save-form-btn"
            >
              Salva
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
