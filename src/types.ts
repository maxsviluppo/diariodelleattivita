export interface Activity {
  id: string;
  name: string;
  iconName: string; // Key corresponding to registered Lucide icons
  color: string;    // Tailwind color class prefix e.g. "rose", "emerald", "amber"
  isCustom: boolean;
}

export interface ActivityLog {
  id: string;
  activityId: string;
  activityName: string; // Snapshot for when the activity gets deleted or modified later
  iconName: string;     // Snapshot of icon
  color: string;        // Snapshot of color
  timestamp: string;    // ISO date string e.g. "2026-06-02T22:49:52Z"
  dateTimeStr: string;   // Localized editable date representation e.g. "2026-06-02T23:50" (for input type="datetime-local")
  notes: string;
}

export interface PresetIcon {
  name: string;
  label: string;
  category?: "summer" | "dance" | "general" | "faces" | "kids" | "babies" | "travel" | "transit";
}
