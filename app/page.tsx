"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, type Variants, useReducedMotion } from "motion/react";
import HeroSection7 from "@/components/hero-section-7";
import Footer1 from "@/components/footer-section-1";
import {
  MapPin,
  ClipboardList,
  WifiOff,
  ShieldCheck,
  CheckCircle2,
  Users,
  EyeOff,
  FileSpreadsheet,
  History,
  Lock,
  ChevronDown,
  ArrowRight,
  Mail,
  Building2,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PublicLandingPage() {
  const shouldReduceMotion = useReducedMotion();
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "admin@dmaf-kassep.org";

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const faqItems = [
    {
      question: "Who can use the KaVa platform?",
      answer:
        "KaVa is reserved for authorized field staff (interviewers, supervisors, and study coordinators) working on the Kano State Surveillance on Stillbirths and Early Neonatal Mortalities (KASSEP) conducted by the Doctors Medical Aid Foundation across 10 LGAs in Kano State.",
    },
    {
      question: "Does KaVa work without an internet connection?",
      answer:
        "Yes. KaVa is built offline-first using client-side IndexedDB storage through Dexie. Field interviewers can locate Enumeration Areas, conduct complete Section A–F interviews, and save drafts without cellular coverage. When an internet connection becomes available, data syncs safely to the central server.",
    },
    {
      question: "How do I get an account?",
      answer:
        "Accounts are created by your administrator. There is no public registration to protect respondent privacy and ensure data integrity. If you are an enrolled interviewer or supervisor, your study coordinator will provide your login credentials.",
    },
    {
      question: "How is household survey data protected?",
      answer:
        "Data access is enforced at the database level with Row-Level Security (RLS). Interviewers can only access their assigned Enumeration Areas. Personal identifiers are protected, immutable audit logs record every submission, and surveillance export files can be de-identified.",
    },
    {
      question: "What languages are supported in the field questionnaire?",
      answer:
        "KaVa supports seamless bilingual switching between English and Hausa for all survey instructions, questions, and response categories, ensuring clear communication with community respondents.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-foreground">
      {/* 1. Header & 2. Hero Section (built with hero-section-7 and embedded ProductPreview) */}
      <HeroSection7 />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-24 py-16">
        {/* =========================================================================
            SECTION 3: What KaVa Does (4 Cards)
           ========================================================================= */}
        <section id="features" aria-labelledby="features-heading" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              Core Capabilities
            </span>
            <h2 id="features-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              What KaVa Does
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Designed specifically for Kano State field operations, replacing paper questionnaires with structured, offline-reliable surveillance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: EA Map & Sampling */}
            <motion.article
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              whileHover={shouldReduceMotion ? {} : { y: -3 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3 transition-shadow hover:shadow-md"
            >
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <MapPin className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Kano EA Map & Sampling
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Interactive basemap of ~140 Enumeration Areas across 10 Kano LGAs. Real-time boundary visualization, GPS tracking, and tracking of 10 sampled households per cluster.
              </p>
            </motion.article>

            {/* Card 2: Guided Skip-Logic Interviews */}
            <motion.article
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              whileHover={shouldReduceMotion ? {} : { y: -3 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3 transition-shadow hover:shadow-md"
            >
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <ClipboardList className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Guided Skip-Logic Interviews
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Structured multi-level survey steps covering Household Info, Female Roster (women aged 15-49), Mortality Screening, Pregnancy Episodes, and Neonatal Outcomes with automated rule checks.
              </p>
            </motion.article>

            {/* Card 3: Offline-First Data Collection */}
            <motion.article
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              whileHover={shouldReduceMotion ? {} : { y: -3 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3 transition-shadow hover:shadow-md"
            >
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <WifiOff className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Offline-First Data Collection
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full client-side persistence in IndexedDB through Dexie. Field interviewers can work entirely offline in low-connectivity settlements with seamless background synchronization.
              </p>
            </motion.article>

            {/* Card 4: Supervisor Review & Exports */}
            <motion.article
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              whileHover={shouldReduceMotion ? {} : { y: -3 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3 transition-shadow hover:shadow-md"
            >
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Supervisor Review & Exports
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automated quality review queue for maternal deaths, stillbirths, and count discrepancies. Field supervisors verify data quality and export de-identified multi-level datasets.
              </p>
            </motion.article>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: How It Works (4 Steps)
           ========================================================================= */}
        <section id="how-it-works" aria-labelledby="how-it-works-heading" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              Surveillance Workflow
            </span>
            <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Four coordinated steps ensuring high data quality from rural and urban Kano communities to research analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 relative">
              <div className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10 inline-block">
                Step 01
              </div>
              <h3 className="text-sm font-semibold text-foreground">EA Assigned</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Field interviewers are explicitly assigned Enumeration Area codes by the study coordinator within designated LGAs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 relative">
              <div className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10 inline-block">
                Step 02
              </div>
              <h3 className="text-sm font-semibold text-foreground">Household Interviewed</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Step-by-step interview wizard captures household consent, eligible women roster, recent deaths, and pregnancy history.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 relative">
              <div className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10 inline-block">
                Step 03
              </div>
              <h3 className="text-sm font-semibold text-foreground">Data Synced & Checked</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Interviews are saved locally in draft, synchronized relationally to Supabase, and evaluated for quality review flags.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 relative">
              <div className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10 inline-block">
                Step 04
              </div>
              <h3 className="text-sm font-semibold text-foreground">Supervisor Review & Export</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Supervisors review and clear flagged cases. Verified survey data is exported in de-identified research spreadsheets.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: Built for Field Teams (Roles)
           ========================================================================= */}
        <section id="roles" aria-labelledby="roles-heading" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              Role-Based Access
            </span>
            <h2 id="roles-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Built for Field Teams
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Clear boundaries and role-based permissions ensure that every operator has the exact tools they need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Interviewer Role */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    INTERVIEWER
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">Field Level</span>
                </div>
                <h3 className="text-base font-semibold text-foreground">Field Interviewer</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Conducts in-person household surveys in assigned Kano settlements.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Access strictly restricted to assigned EA codes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Offline-first interview wizard (Sections A–F)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Automatic draft saving and submission queue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>View own review flags and follow-up notes</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Supervisor Role */}
            <div className="p-6 rounded-2xl bg-card border border-primary/30 shadow-xs flex flex-col justify-between space-y-4 relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    SUPERVISOR
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">LGA Level</span>
                </div>
                <h3 className="text-base font-semibold text-foreground">Field Supervisor</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Supervises interviewers and monitors sampling progress across assigned LGAs.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Scoped access across assigned supervisory LGAs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Clear and resolve surveillance review flags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Monitor 10-household completion targets per EA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>View field responses and export research datasets</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Admin Role */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    ADMINISTRATOR
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">Central</span>
                </div>
                <h3 className="text-base font-semibold text-foreground">Study Coordinator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Central coordination, user role provisioning, and research governance.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Full oversight across all 140 EAs in Kano State</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Enroll staff, assign EAs, and control activation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Multi-level Excel exports with PII de-identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>Database audit log inspection and data validation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: Privacy and Security
           ========================================================================= */}
        <section id="security" aria-labelledby="security-heading" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              Data Governance
            </span>
            <h2 id="security-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Privacy and Security
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Ethical surveillance protocols tailored to community health research standards in Kano State.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-card border border-border space-y-2.5">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Lock className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Role-Based Access</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Database Row-Level Security (RLS) ensures interviewers can only query and write records for EAs assigned to their account.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-2.5">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <EyeOff className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Restricted Identifiers</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Household respondent names and contact numbers are protected and restricted from public views.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-2.5">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <History className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Relational Audit Trail</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Central PostgreSQL audit triggers log all record transitions, draft submissions, and supervisor resolutions with user attribution.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-2.5">
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <FileSpreadsheet className="size-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">De-Identified Exports</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Datasets exported for epidemiological analysis have personally identifiable fields masked to safeguard participant confidentiality.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: FAQ (Accordion)
           ========================================================================= */}
        <section id="faq" aria-labelledby="faq-heading" className="space-y-10 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              Frequently Asked Questions
            </span>
            <h2 id="faq-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Common questions about field deployment, accounts, and offline survey capabilities.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                      className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: Final Call to Action
           ========================================================================= */}
        <section
          aria-labelledby="cta-heading"
          className="rounded-3xl p-8 sm:p-12 bg-linear-to-b from-card via-card to-primary/5 border border-primary/20 text-center space-y-6 shadow-sm"
        >
          <div className="max-w-xl mx-auto space-y-3">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Ready for Field Deployment?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Sign in with your verified KASSEP credentials to begin Enumeration Area mapping and household survey collection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 h-11 rounded-xl bg-primary text-primary-foreground font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:opacity-90 active:scale-95 transition-all"
            >
              <span>Log in to Platform</span>
              <ArrowRight className="size-4" />
            </Link>

            <a
              href={`mailto:${contactEmail}`}
              className="w-full sm:w-auto px-6 h-11 rounded-xl border border-border bg-card text-foreground font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-muted active:scale-95 transition-all"
            >
              <Mail className="size-4 text-muted-foreground" />
              <span>Contact Administrator</span>
            </a>
          </div>
        </section>
      </main>

      {/* =========================================================================
          SECTION 9: Footer (footer-section-1)
         ========================================================================= */}
      <Footer1 />
    </div>
  );
}
