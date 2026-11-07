"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, type Variants, useReducedMotion } from "motion/react";
import { FlutedGlass } from "@paper-design/shaders-react";
import { ProductPreview } from "@/components/landing/product-preview";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  SunDim,
  MoonStar,
  ArrowRight,
  Mail,
  ShieldCheck,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Field Roles", href: "#roles" },
  { name: "Security", href: "#security" },
  { name: "FAQ", href: "#faq" },
];

export default function HeroSection7() {
  const shouldReduceMotion = useReducedMotion();
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "admin@dmaf-kassep.org";

  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sync theme with document class
  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof document !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        localStorage.setItem("kava-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        localStorage.setItem("kava-theme", "light");
      }
    }
  };

  // Check auth session on client
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof document !== "undefined") {
        if (document.cookie.includes("kava_session=true")) {
          setIsAuthenticated(true);
          return;
        }
      }
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            setIsAuthenticated(true);
          }
        } catch {}
      }
    };
    checkAuth();

    // Scroll listener for smooth header background change
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative w-full overflow-hidden antialiased bg-linear-to-b from-primary/15 via-background to-background text-foreground transition-colors">
      {/* Background Shader: gentle shader with fallback */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-25">
        <FlutedGlass
          size={0.89}
          shape="lines"
          angle={0}
          distortionShape="prism"
          distortion={0.35}
          shift={0}
          blur={0}
          edges={0.25}
          stretch={0}
          scale={1.11}
          fit="cover"
          highlights={0.1}
          shadows={0.2}
          grainMixer={0.08}
          grainOverlay={0.08}
          colorBack="#00000000"
          colorHighlight={isDark ? "#0ab1ba" : "#FFFFFF"}
          colorShadow="#000000"
          className="w-full h-full bg-transparent"
        />
      </div>

      {/* Sticky Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/85 backdrop-blur-md shadow-xs"
            : "bg-transparent"
        )}
      >
        <nav
          aria-label="Main Navigation"
          className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
                KaVa
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">
                  KASSEP
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">
                Doctors Medical Aid Foundation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Header Actions: Theme Toggle + Login / Dashboard Button */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg border border-border bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {isDark ? <SunDim className="size-4" /> : <MoonStar className="size-4" />}
            </button>

            {/* Auth CTA Button */}
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-medium shadow-xs hover:opacity-90 active:scale-95 transition-all"
              >
                <span>Open dashboard</span>
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-medium shadow-xs hover:opacity-90 active:scale-95 transition-all"
              >
                <span>Log in</span>
                <ArrowRight className="size-3.5" />
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground py-1"
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Hero Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-start text-center pt-12 md:pt-20 px-4 sm:px-6 pb-0 max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          {/* Official Study Badge */}
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono font-medium">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              KASSEP • Household Surveillance Assessment
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.15] tracking-tight mb-5"
          >
            Locate Enumeration Areas.
            <br className="hidden sm:block" />
            <span className="text-primary"> Record Every Pregnancy</span> & Outcome Across Kano.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-muted-foreground font-normal max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            A dedicated, field-ready platform designed for field interviewers, supervisors, and coordinators. Built for offline-capable data collection, structured skip-logic interviews, and privacy-first maternal and neonatal mortality surveillance.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
          >
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <span>Log in to Platform</span>
                <ArrowRight className="size-4" />
              </Link>
            )}

            <a
              href={`mailto:${contactEmail}`}
              className="w-full sm:w-auto px-6 h-12 rounded-xl border border-border bg-card/80 hover:bg-card text-foreground font-medium text-sm flex items-center justify-center gap-2 hover:border-primary/40 active:scale-95 transition-all cursor-pointer"
            >
              <Mail className="size-4 text-muted-foreground" />
              <span>Contact Administrator</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Real Product Preview: Live Map & Wizard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto mt-12 md:mt-16 z-20 flex justify-center px-1 sm:px-0"
        >
          <ProductPreview />
        </motion.div>
      </div>

      {/* Subtle Bottom Fade to integrate smoothly into Section 3 */}
      <div className="w-full h-16 md:h-24 pointer-events-none bg-linear-to-b from-transparent to-background" />
    </div>
  );
}
