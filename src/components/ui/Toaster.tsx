"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

// Global toast store
let listeners: Array<(toasts: ToastItem[]) => void> = [];
let toasts: ToastItem[] = [];

function notify(listeners: Array<(toasts: ToastItem[]) => void>, newToasts: ToastItem[]) {
  listeners.forEach((l) => l(newToasts));
}

export function toast({
  title,
  description,
  variant = "default",
  duration = 5000,
}: {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}) {
  const id = Math.random().toString(36).slice(2);
  const newToast: ToastItem = { id, title, description, variant, duration };
  toasts = [...toasts, newToast];
  notify(listeners, toasts);

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify(listeners, toasts);
  }, duration);
}

export function Toaster() {
  const [localToasts, setLocalToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setLocalToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setLocalToasts);
    };
  }, []);

  const variants: Record<ToastVariant, string> = {
    default: "bg-white dark:bg-gray-900 border-gray-200 text-gray-900 dark:text-gray-100",
    success: "bg-green-50 dark:bg-green-900/20 border-green-300 text-green-900 dark:text-green-100",
    error: "bg-red-50 dark:bg-red-900/20 border-red-300 text-red-900 dark:text-red-100",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-300 text-amber-900 dark:text-amber-100",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-300 text-blue-900 dark:text-blue-100",
  };

  const icons: Record<ToastVariant, string> = {
    default: "ℹ️",
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "📌",
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 pointer-events-none"
    >
      {localToasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            "pointer-events-auto flex gap-3 rounded-xl border p-4 shadow-lg animate-fade-in-up",
            variants[t.variant]
          )}
        >
          <span className="text-lg shrink-0" aria-hidden>
            {icons[t.variant]}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && (
              <p className="text-xs mt-0.5 opacity-80">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => {
              toasts = toasts.filter((i) => i.id !== t.id);
              notify(listeners, toasts);
            }}
            aria-label="Dismiss notification"
            className="shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
