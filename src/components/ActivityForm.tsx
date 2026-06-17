import React, { useState, useEffect } from "react";
import { Activity } from "../types";
import { PRESET_ICONS, PASTEL_COLORS, ICON_TRANSLATIONS } from "../data";
import IconRenderer from "./IconRenderer";
import { motion } from "motion/react";
import { X, Search } from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState<"all" | "summer" | "dance" | "general" | "faces" | "kids" | "babies" | "travel" | "transit" | "business">("all");

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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white/95 backdrop-blur-md rounded-[32px] p-5 md:p-6 w-full max-w-lg shadow-2xl border border-pink-100 max-h-[92vh] flex flex-col"
        id="activity-form-container"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h3 className="text-xl font-black text-sleek-text tracking-tight animate-fade-in" id="form-title">
            {activityToEdit ? "Modifica Attività" : "Nuova Attività"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full hover:bg-sleek-light text-sleek-text-muted hover:text-sleek-accent transition-colors cursor-pointer"
            id="close-form-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden space-y-4">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            
            {/* 1st Row: Icon Preview Left + Activity Name Input Right */}
            <div className="flex items-center gap-3 bg-pink-50/20 p-3 rounded-2xl border border-pink-200/20 shadow-2xs">
              {/* Preview bubble */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div
                  className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all duration-300 border ${currentColorConfig.bg} ${currentColorConfig.text} ${currentColorConfig.border} shadow-sm`}
                >
                  <IconRenderer name={selectedIcon} className="w-7 h-7 stroke-[1.5]" />
                </div>
              </div>

              {/* Input block adjacent */}
              <div className="flex-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-sleek-text-muted mb-1" id="label-nome">
                  Nome Attività
                </label>
                <input
                  type="text"
                  required
                  placeholder="Es. Yoga, Spesa, Birra..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-sleek-accent bg-white text-sleek-text transition-all font-bold placeholder-pink-700/25"
                  id="input-activity-name"
                  maxLength={25}
                />
              </div>
            </div>

            {/* 2nd Section: Colors horizontal scrolling selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-sleek-text-muted">
                Colore della scheda ({PASTEL_COLORS.length})
              </label>
              <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-1 px-1 scrollbar-none snap-x select-none">
                {PASTEL_COLORS.map((color) => {
                  const isActive = selectedColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={`h-9 px-3.5 rounded-xl flex items-center justify-center border transition-all shrink-0 snap-start cursor-pointer ${
                        color.bg
                      } ${color.text} ${
                        isActive
                          ? "border-pink-500 ring-2 ring-pink-500/20 scale-[1.03] shadow-xs font-bold"
                          : "border-pink-100/50 hover:scale-[1.02] hover:border-pink-200"
                      }`}
                      title={color.name}
                      id={`color-btn-${color.id}`}
                    >
                      <span className="text-xs font-bold">{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3rd Section: Icon scrolling selection search, categories and scroll content */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-sleek-text-muted">
                  Seleziona Icona ({filteredIcons.length})
                </label>
                {/* Search query compact form */}
                <div className="relative w-full sm:w-56">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-pink-300">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Cerca icona..."
                    value={iconSearchQuery}
                    onChange={(e) => setIconSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 text-xs font-bold rounded-xl border border-pink-150 focus:outline-none focus:ring-2 focus:ring-sleek-accent/40 bg-white text-sleek-text placeholder-pink-700/35 transition-all shadow-2xs"
                    id="icon-search-input"
                  />
                  {iconSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setIconSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sleek-text-muted hover:text-sleek-accent text-xs font-black cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Category buttons in scrollable line bar */}
              <div className="flex gap-1.5 p-1 bg-pink-100/10 border border-pink-100/30 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-none select-none" id="icon-category-tabs">
                {[
                  { id: "all", label: "Tutte" },
                  { id: "business", label: "Business 💼" },
                  { id: "summer", label: "Estate ☀️" },
                  { id: "dance", label: "Ballo 💃" },
                  { id: "faces", label: "Faccine 😄" },
                  { id: "kids", label: "Bimbi 👶" },
                  { id: "babies", label: "Bebè 🍼" },
                  { id: "travel", label: "Viaggi ✈️" },
                  { id: "transit", label: "Trasporti 🚲" },
                  { id: "general", label: "Generali" }
                ].map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`py-1.5 px-3 text-[10px] rounded-lg shrink-0 font-extrabold transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-pink-500 to-rose-450 text-white shadow-3xs"
                          : "text-slate-700 hover:text-slate-900 bg-white hover:bg-white/80"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Icons Horizontal scroll box - icons are larger! */}
              <div className="border border-pink-100/60 rounded-2xl bg-pink-50/10 p-2.5">
                {filteredIcons.length > 0 ? (
                  // Uses a double row height-capped layout so items scroll horizontally neatly
                  <div className="flex flex-col flex-wrap h-[155px] overflow-x-auto gap-3 pb-2 scrollbar-thin snap-x px-0.5">
                    {filteredIcons.map((icon, idx) => {
                      const isSelected = selectedIcon === icon.name;
                      return (
                        <button
                          key={`${icon.category}-${icon.name}-${idx}`}
                          type="button"
                          onClick={() => setSelectedIcon(icon.name)}
                          className={`w-14 h-14 shrink-0 rounded-[18px] flex flex-col items-center justify-center transition-all snap-start cursor-pointer border ${
                            isSelected
                              ? `${currentColorConfig.bg} ${currentColorConfig.text} border-pink-400 font-extrabold shadow-sm ring-1 ring-pink-500/20`
                              : "bg-white border-pink-100/50 hover:border-pink-200 text-slate-500 hover:text-pink-600"
                          }`}
                          title={icon.label}
                          id={`icon-select-${icon.category}-${icon.name}-${idx}`}
                        >
                          <IconRenderer name={icon.name} className="w-6.5 h-6.5 stroke-[1.6]" />
                          <span className="text-[8px] mt-1 text-center truncate w-full px-0.5 text-slate-400 font-bold" title={ICON_TRANSLATIONS[icon.name] || icon.name}>
                            {ICON_TRANSLATIONS[icon.name] || icon.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-sleek-text-muted italic">
                    Nessun'icona trovata per "{iconSearchQuery}"
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Form Actions footer */}
          <div className="flex gap-3 pt-2 shrink-0 border-t border-pink-50/70">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-pink-50/60 hover:bg-pink-100/50 text-slate-700 font-bold transition-all cursor-pointer text-center text-xs"
              id="cancel-form-btn"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-black shadow-md shadow-pink-200/50 hover:shadow-lg transition-all cursor-pointer text-center text-xs uppercase tracking-wider"
              id="save-form-btn"
            >
              {activityToEdit ? "Salva Modifiche" : "Crea Attività"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
