"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToastItem {
  id: string;
  message: string;
  variant: "success" | "error" | "info";
}

interface ToastContextValue {
  showToast: (message: string, variant: ToastItem["variant"]) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

// ─── Individual Toast ─────────────────────────────────────────────────────────

export interface ToastNotificationProps {
  id: string;
  message: string;
  variant: "success" | "error" | "info";
  onDismiss: (id: string) => void;
}

const VARIANT_STYLES = {
  success: {
    wrapper: "bg-navy text-white",
    icon: CheckCircleIcon,
    iconClass: "h-5 w-5 text-white flex-shrink-0 mt-0.5",
  },
  error: {
    wrapper: "bg-crimson text-white",
    icon: ExclamationCircleIcon,
    iconClass: "h-5 w-5 text-white flex-shrink-0 mt-0.5",
  },
  info: {
    wrapper: "bg-white border border-line text-navy",
    icon: InformationCircleIcon,
    iconClass: "h-5 w-5 text-ink-muted flex-shrink-0 mt-0.5",
  },
} as const;

export function ToastNotification({
  id,
  message,
  variant,
  onDismiss,
}: ToastNotificationProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Enter animation
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Auto-dismiss after 4000ms
  useEffect(() => {
    timerRef.current = setTimeout(() => handleDismiss(), 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDismiss() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    // Remove from DOM after exit animation completes
    setTimeout(() => onDismiss(id), 200);
  }

  const styles = VARIANT_STYLES[variant];
  const Icon = styles.icon;

  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={cn(
        "pointer-events-auto w-80 flex items-start gap-3 px-4 py-3 rounded-card shadow-card-dark",
        "motion-safe:transition-all motion-safe:duration-200",
        styles.wrapper,
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
    >
      <div className="flex items-start gap-3 flex-1">
        <Icon className={styles.iconClass} aria-hidden="true" />
        <p className="font-sans text-sm flex-1">{message}</p>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={handleDismiss}
        className="flex-shrink-0 -mt-0.5 ml-1 p-0.5 rounded opacity-70 hover:opacity-100 transition-opacity duration-150"
      >
        <XMarkIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-label="Notifications"
      className="fixed top-4 right-4 z-tooltip flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastItem["variant"]) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => {
        // Cap at 5 simultaneous toasts — dismiss oldest if needed
        const updated = [...prev, { id, message, variant }];
        return updated.length > 5 ? updated.slice(updated.length - 5) : updated;
      });
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
