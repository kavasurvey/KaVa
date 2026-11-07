"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants, useReducedMotion } from "motion/react";
import { Mail, MapPin } from "lucide-react";

export default function Footer1() {
  const shouldReduceMotion = useReducedMotion();
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "admin@dmaf-kassep.org";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Field Roles", href: "#roles" },
    { name: "Privacy & Security", href: "#security" },
    { name: "FAQ", href: "#faq" },
    { name: "Operator Login", href: "/login" },
  ];

  return (
    <footer className="w-full py-12 md:py-16 bg-card border-t border-border text-foreground transition-colors overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-8 mb-8"
      >
        {/* KaVa Brand & Subtitle */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              K
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              KaVa
            </span>
          </div>
          <p className="text-xs sm:text-sm text-primary font-mono font-medium">
            A KASSEP assessment platform
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Doctors Medical Aid Foundation • Kano State Surveillance on Stillbirths and Early Neonatal Mortalities
          </p>
        </motion.div>

        {/* Section Navigation Links */}
        <motion.nav
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-muted-foreground"
        >
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-primary transition-colors py-1 px-1.5 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
            >
              {item.name}
            </Link>
          ))}
        </motion.nav>

        {/* Contact Email Link */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Mail className="size-3.5 text-primary" />
          <a
            href={`mailto:${contactEmail}`}
            className="text-foreground hover:text-primary transition-colors hover:underline"
          >
            {contactEmail}
          </a>
        </motion.div>
      </motion.div>

      {/* Decorative Subtle Line */}
      <div className="w-full border-t border-border my-6 opacity-60" />

      {/* Copyright & Location */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground font-mono gap-3 text-center sm:text-left">
        <div>
          &copy; 2026 Doctors Medical Aid Foundation. All rights reserved.
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <MapPin className="size-3 text-primary" />
          <span>Kano State, Federal Republic of Nigeria</span>
        </div>
      </div>
    </footer>
  );
}
