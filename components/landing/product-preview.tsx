"use client";

import React, { useState } from "react";
import {
  MapPin,
  CheckCircle2,
  Clock,
  Home,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState<"map" | "interview">("map");

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden text-foreground">
      {/* Window Titlebar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/60 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-amber-500/60" />
            <span className="size-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-xs font-mono font-medium text-muted-foreground ml-2 hidden sm:inline">
            KaVa Field Surveillance Platform • Kano State
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-card border border-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            className={cn(
              "px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === "map"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MapPin className="size-3.5" />
            <span>EA Map & Sampling</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("interview")}
            className={cn(
              "px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer",
              activeTab === "interview"
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ClipboardList className="size-3.5" />
            <span>Interview Wizard</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Live Kano EA Map & Sampling Preview */}
      {activeTab === "map" && (
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] text-xs">
          {/* Left: EA List */}
          <div className="md:col-span-5 border-r border-border p-3 space-y-2 bg-muted/20">
            <div className="flex items-center justify-between px-1 text-[11px] font-mono text-muted-foreground">
              <span>Selected LGAs: Kano Municipal, Dala, Fagge</span>
              <span className="text-primary font-semibold">10/140 EAs</span>
            </div>

            <div className="space-y-2">
              {/* EA 1 */}
              <div className="p-3 rounded-xl bg-card border border-primary/30 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-primary">KAN-MUN-001</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    In Progress
                  </span>
                </div>
                <div className="font-medium text-foreground">Shahuchi North • Shahuchi Ward</div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Kano Municipal</span>
                  <span>7 / 10 HHs sampled</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "70%" }} />
                </div>
              </div>

              {/* EA 2 */}
              <div className="p-3 rounded-xl bg-card/60 border border-border space-y-2 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">KAN-DAL-001</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-mono">
                    In Progress
                  </span>
                </div>
                <div className="font-medium text-foreground">Gwammaja Primary • Gwammaja Ward</div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Dala LGA</span>
                  <span>4 / 10 HHs sampled</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "40%" }} />
                </div>
              </div>

              {/* EA 3 */}
              <div className="p-3 rounded-xl bg-card/60 border border-border space-y-2 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">KAN-FAG-001</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
                    Complete
                  </span>
                </div>
                <div className="font-medium text-foreground">Fagge A Central • Fagge Ward</div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Fagge LGA</span>
                  <span>10 / 10 HHs sampled</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map Simulation & Detail Pane */}
          <div className="md:col-span-7 p-4 flex flex-col justify-between bg-card relative">
            {/* Simulated Vector Grid / Map Area */}
            <div className="h-44 w-full rounded-xl bg-muted/40 border border-border relative overflow-hidden flex items-center justify-center">
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0ab1ba_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Simulated Map Markers */}
              <div className="absolute top-10 left-16 flex items-center gap-1.5 bg-card px-2 py-1 rounded-full border border-primary shadow-md">
                <span className="size-2 rounded-full bg-primary" />
                <span className="text-[10px] font-mono font-bold">KAN-MUN-001</span>
              </div>

              <div className="absolute bottom-12 left-44 flex items-center gap-1.5 bg-card px-2 py-1 rounded-full border border-amber-500 shadow-md">
                <span className="size-2 rounded-full bg-amber-500" />
                <span className="text-[10px] font-mono font-bold">KAN-DAL-001</span>
              </div>

              <div className="absolute top-16 right-20 flex items-center gap-1.5 bg-card px-2 py-1 rounded-full border border-emerald-500 shadow-md">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono font-bold">KAN-FAG-001</span>
              </div>

              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-muted-foreground bg-background/80 px-2 py-0.5 rounded backdrop-blur">
                Lat: 12.0022° N • Long: 8.5244° E
              </div>
            </div>

            {/* Selected EA Action Bar */}
            <div className="mt-4 p-3.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-medium text-foreground flex items-center gap-2">
                  <span>Assigned Operator: Ibrahim Bello</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary">Interviewer</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  Target: 10 Households • Segment: 01 • Ward: Shahuchi
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-xs shadow-xs">
                <span>Start Assessment</span>
                <ArrowRight className="size-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live Survey Interview Step Preview */}
      {activeTab === "interview" && (
        <div className="p-4 sm:p-6 space-y-4 text-xs bg-card min-h-[380px]">
          {/* Header pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold border border-primary/20">
                HH ID: KAN-01-204
              </span>
              <span className="text-muted-foreground font-mono">EA: KAN-MUN-001</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="size-3.5" />
              <span>IndexedDB Autosaved (Offline Ready)</span>
            </div>
          </div>

          {/* Form Questions */}
          <div className="space-y-4 max-w-xl mx-auto py-2">
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>Item A08 • Informed Consent</span>
                <span className="text-emerald-600 font-semibold">Consent Confirmed</span>
              </div>
              <p className="text-xs text-foreground font-medium">
                Was verbal informed consent obtained from the household head or adult respondent?
              </p>
              <div className="flex gap-2 pt-1">
                <span className="px-3 py-1 rounded-md bg-primary text-primary-foreground font-medium text-xs">
                  Yes [1]
                </span>
                <span className="px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs opacity-60">
                  No [2]
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>Item A10 • Eligible Women Screening</span>
                <span className="text-primary font-semibold">Roster Trigger</span>
              </div>
              <p className="text-xs text-foreground font-medium">
                Number of women aged 15-49 who slept in this household during the reference period:
              </p>
              <div className="flex items-center gap-3">
                <div className="px-4 py-1.5 rounded-lg border border-primary bg-card font-mono text-sm font-bold text-primary">
                  2 Eligible Women
                </div>
                <span className="text-[11px] text-muted-foreground">
                  → Automatically routes to Section B: Individual Female Roster
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Footer */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-[11px] text-muted-foreground font-mono">
              Step 1 of 7: Section A Household Information
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-xs shadow-xs">
              <span>Next: Section B Female Roster</span>
              <ArrowRight className="size-3.5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

