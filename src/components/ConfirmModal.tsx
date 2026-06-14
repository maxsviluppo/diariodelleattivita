import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Elimina",
  cancelText = "Annulla",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs"
        id="confirm-modal-overlay"
      />

      {/* Modal Dialog Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl border border-pink-100/80 z-10 text-center"
        id="confirm-modal-box"
      >
        {/* Floating close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-pink-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Chiudi"
          id="confirm-modal-close-btn"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Container */}
        <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
          <Trash2 className="w-6 h-6 stroke-[1.8]" />
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-extrabold text-slate-800 tracking-tight" id="confirm-modal-title">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed px-1" id="confirm-modal-message">
          {message}
        </p>

        {/* Button Panel */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer active:scale-98"
            id="confirm-modal-cancel-btn"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-650 transition-all cursor-pointer shadow-sm active:scale-98"
            id="confirm-modal-confirm-btn"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
