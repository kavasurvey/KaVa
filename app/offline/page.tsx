"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, Home, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflineFallbackPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center text-foreground">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col items-center space-y-4">
        <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <WifiOff className="size-8" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            You Are Currently Offline
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The page you requested is not cached on this device. However, your assigned Enumeration Areas and survey questionnaires remain fully available offline.
          </p>
        </div>

        <div className="w-full p-3.5 rounded-xl bg-muted/50 border border-border text-xs text-left space-y-1 font-mono text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Database className="size-3.5 text-primary" />
            <span>Local Storage Active</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Interviews conducted while offline are saved securely in IndexedDB and queued for synchronization.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 pt-2">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full gap-2 text-xs h-11 font-medium">
              <Home className="size-4" />
              <span>Return to KaVa Dashboard</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full gap-2 text-xs h-10 border-border"
          >
            <RefreshCw className="size-3.5" />
            <span>Retry Connection</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

