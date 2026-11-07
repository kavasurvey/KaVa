"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  WifiOff,
  Wifi,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import { surveySyncService } from "@/lib/db/sync";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncState, setSyncState] = useState<"idle" | "syncing" | "synced" | "failed">("idle");
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);

  // Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Update Available State
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  // Refresh pending count
  const refreshPendingCount = useCallback(async () => {
    try {
      const count = await surveySyncService.getPendingSyncCount();
      setPendingCount(count);
    } catch {}
  }, []);

  // Trigger sync of queued interviews
  const handleTriggerSync = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return;
    }

    setSyncState("syncing");
    setSyncErrorMessage(null);

    try {
      const result = await surveySyncService.syncQueuedInterviews();
      await refreshPendingCount();

      if (result.failedCount > 0) {
        setSyncState("failed");
        setSyncErrorMessage(result.errors[0] || `${result.failedCount} records failed to sync`);
      } else {
        setSyncState("synced");
        // Clear synced banner after 4 seconds
        setTimeout(() => {
          setSyncState("idle");
        }, 4000);
      }
    } catch (err: any) {
      setSyncState("failed");
      setSyncErrorMessage(err.message || "Failed to complete background sync");
    }
  }, [refreshPendingCount]);

  useEffect(() => {
    // 1. Initial Online State
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }
    refreshPendingCount();

    // 2. Service Worker Registration & Update Detection
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check if waiting worker exists
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            setUpdateAvailable(true);
          }

          // Check on updatefound
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setWaitingWorker(newWorker);
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("[PWA] Service worker registration error:", err);
        });
    }

    // 3. Online/Offline Listeners
    const onOnline = () => {
      setIsOnline(true);
      handleTriggerSync();
    };

    const onOffline = () => {
      setIsOnline(false);
      refreshPendingCount();
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // 4. BeforeInstallPrompt Listener
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      const prompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(prompt);
      setShowInstallPrompt(true);
      // Expose globally so ProfileMenu can trigger installation
      (window as any).__kavaInstallPrompt = prompt;
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // 5. AppInstalled Listener
    const onAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      (window as any).__kavaInstallPrompt = undefined;
    };
    window.addEventListener("appinstalled", onAppInstalled);

    // Periodic pending count check (every 10s)
    const interval = setInterval(refreshPendingCount, 10000);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
      clearInterval(interval);
    };
  }, [handleTriggerSync, refreshPendingCount]);

  // Install App Action
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  // Update App Action
  const handleUpdateClick = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  return (
    <aside aria-label="System status & notifications" className="fixed top-0 left-0 right-0 z-50 flex flex-col pointer-events-none">
      {/* A. Offline Banner */}
      {!isOnline && (
        <div className="w-full bg-amber-500 text-amber-950 px-4 py-2 text-xs font-medium flex items-center justify-between shadow-md pointer-events-auto">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <WifiOff className="size-4 shrink-0 text-amber-950" />
            <span>
              <strong>Offline</strong> — changes saved on this device.
            </span>
            {pendingCount > 0 && (
              <span className="font-mono px-2 py-0.5 rounded-full bg-amber-600/20 text-amber-950 font-bold text-[11px]">
                {pendingCount} interview{pendingCount > 1 ? "s" : ""} queued for sync
              </span>
            )}
          </div>
        </div>
      )}

      {/* B. Sync Status Banners (When Online) */}
      {isOnline && syncState === "syncing" && (
        <div className="w-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium flex items-center justify-center gap-2 shadow-md pointer-events-auto">
          <RefreshCw className="size-3.5 animate-spin" />
          <span>Synchronizing queued field interviews with central database...</span>
        </div>
      )}

      {isOnline && syncState === "synced" && (
        <div className="w-full bg-emerald-600 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-center gap-2 shadow-md pointer-events-auto transition-all">
          <CheckCircle2 className="size-3.5" />
          <span>All queued field interviews synchronized successfully!</span>
        </div>
      )}

      {isOnline && syncState === "failed" && (
        <div className="w-full bg-destructive text-destructive-foreground px-4 py-1.5 text-xs font-medium flex items-center justify-between shadow-md pointer-events-auto">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <AlertTriangle className="size-3.5 shrink-0" />
            <span className="truncate">
              Sync warning: {syncErrorMessage || "Could not synchronize interviews. Will retry automatically."}
            </span>
            <button
              type="button"
              onClick={handleTriggerSync}
              className="ml-auto underline hover:opacity-85 font-semibold text-xs cursor-pointer"
            >
              Retry Now
            </button>
          </div>
        </div>
      )}

      {/* C. Update Available Prompt */}
      {updateAvailable && (
        <div className="mx-auto mt-2 max-w-md w-full px-4 pointer-events-auto">
          <div className="p-3 rounded-xl bg-card border border-primary/30 shadow-lg text-xs text-foreground flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary shrink-0" />
              <span>A new version of KaVa is available.</span>
            </div>
            <Button
              size="sm"
              onClick={handleUpdateClick}
              className="h-7 text-xs font-medium gap-1 px-2.5"
            >
              Update Now
            </Button>
          </div>
        </div>
      )}

      {/* D. Install App Prompt Banner */}
      {showInstallPrompt && (
        <div className="mx-auto mt-2 max-w-md w-full px-4 pointer-events-auto">
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-lg text-xs text-foreground flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                KV
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-foreground truncate">Install KaVa App</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  Field-ready offline installation for Kano State
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="h-7 text-xs font-medium gap-1 px-2.5"
              >
                <Download className="size-3" />
                <span>Install</span>
              </Button>
              <button
                type="button"
                aria-label="Dismiss install prompt"
                onClick={() => setShowInstallPrompt(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-md"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

