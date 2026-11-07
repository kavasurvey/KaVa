"use client";

import React, { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { ShieldCheck, MapPin, Database, WifiOff } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerContent?: ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footerContent,
}: AuthLayoutProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground antialiased relative">
      {/* Left Form Section */}
      <div className="flex w-full flex-col lg:w-1/2 justify-between p-6 sm:p-10 lg:p-12 relative z-10">
        {/* Top Header Branding */}
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
                KaVa
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/15 text-primary border border-primary/20 font-semibold">
                  KASSEP
                </span>
              </span>
              
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            Back to Home
          </Link>
        </header>

        {/* Center Form Container */}
        <div className="flex flex-1 items-center justify-center py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[420px]"
          >
            {/* Header Titles */}
            <motion.div variants={itemVariants} className="mb-6 text-left">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </motion.div>

            {/* Form Content */}
            <motion.div variants={itemVariants}>{children}</motion.div>

            {/* Footer */}
            {footerContent && (
              <motion.div
                variants={itemVariants}
                className="mt-6 text-center text-xs text-muted-foreground"
              >
                {footerContent}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom Disclaimer */}
        <footer className="text-left text-[11px] text-muted-foreground font-mono border-t border-border pt-4">
          <span>Kano State Surveillance on Stillbirths & Early Neonatal Mortalities</span>
          <span className="mx-2">•</span>
          <span>Restricted to Authorized Field Staff</span>
        </footer>
      </div>

      {/* Right Visual Section (auth-07 inspired) */}
      <div className="hidden lg:flex lg:w-1/2 p-6 lg:p-8 flex-col justify-between relative bg-muted/40 border-l border-border">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />

        <div className="relative z-10 flex justify-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/80 backdrop-blur border border-border text-xs font-mono text-muted-foreground shadow-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Field-Ready Surveillance
          </div>
        </div>

        {/* Informative Showcase Card */}
        <div className="relative z-10 max-w-lg mx-auto w-full my-auto space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Kano State Field Survey</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">~140 EAs Across 10 LGAs</p>
              </div>
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MapPin className="size-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
                  <Database className="size-3.5 text-primary" />
                  <span>Audit Trail</span>
                </div>
                <div className="font-semibold text-foreground">Draft-to-Submit</div>
                <div className="text-[10px] text-muted-foreground">Immutable audit logs on change</div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
                  <WifiOff className="size-3.5 text-primary" />
                  <span>IndexedDB</span>
                </div>
                <div className="font-semibold text-foreground">Offline-First</div>
                <div className="text-[10px] text-muted-foreground">Local storage during field visits</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/15 text-xs text-foreground flex items-start gap-2.5">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                <strong className="text-foreground font-medium">Privacy & Security:</strong> Access is controlled strictly via role-based security policies. Interviewers collect data only within their assigned Enumeration Areas.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>Doctors Medical Aid Foundation</span>
          <span>v1.0 • Kano, Nigeria</span>
        </div>
      </div>
    </div>
  );
}

