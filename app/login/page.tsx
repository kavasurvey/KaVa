"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { surveySyncService } from "@/lib/db/sync";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_SEC = 60;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rate Limiting States
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Load lockout state from sessionStorage
  useEffect(() => {
    try {
      const storedAttempts = parseInt(sessionStorage.getItem("kava_login_attempts") || "0", 10);
      const storedLockout = parseInt(sessionStorage.getItem("kava_lockout_until") || "0", 10);
      const now = Math.floor(Date.now() / 1000);

      setFailedAttempts(storedAttempts);
      if (storedLockout > now) {
        setLockoutTimer(storedLockout - now);
      }
    } catch {}
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem("kava_lockout_until");
          sessionStorage.setItem("kava_login_attempts", "0");
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const recordFailedAttempt = () => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    sessionStorage.setItem("kava_login_attempts", nextAttempts.toString());

    if (nextAttempts >= MAX_ATTEMPTS) {
      const now = Math.floor(Date.now() / 1000);
      const lockoutUntil = now + LOCKOUT_DURATION_SEC;
      sessionStorage.setItem("kava_lockout_until", lockoutUntil.toString());
      setLockoutTimer(LOCKOUT_DURATION_SEC);
      setErrorMessage(
        `Too many failed attempts. Temporary lockout active for ${LOCKOUT_DURATION_SEC} seconds.`
      );
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Supabase Authentication
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          recordFailedAttempt();
          throw new Error(error.message);
        }

        const user = data.user;
        if (!user) {
          throw new Error("Unable to retrieve user session.");
        }

        // 2. Fetch User Profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        // 3. Status Verification: Inactive users are signed out and blocked
        if (!profile || profile.status === "inactive") {
          await supabase.auth.signOut();
          document.cookie = "kava_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
          throw new Error("Your account is not active. Contact your administrator.");
        }

        // 4. Force password change if user has temporary password metadata
        const mustChangePassword =
          user.user_metadata?.must_change_password === true ||
          user.app_metadata?.must_change_password === true;

        if (mustChangePassword) {
          document.cookie = "kava_session=true; path=/; max-age=86400; SameSite=Lax";
          router.push(`/reset-password?force=true&email=${encodeURIComponent(user.email || "")}`);
          return;
        }

        // 5. Cache profile in local Dexie and set session cookie
        await surveySyncService.upsertProfile({
          id: profile.id,
          role: profile.role,
          fullName: profile.full_name || email.split("@")[0],
          email: profile.email || email,
          phone: profile.phone || "",
          assignedLgas: profile.assigned_lgas || [],
          assignedEas: profile.assigned_eas || [],
          status: "active",
        });

        document.cookie = "kava_session=true; path=/; max-age=86400; SameSite=Lax";
        sessionStorage.removeItem("kava_login_attempts");
        sessionStorage.removeItem("kava_lockout_until");

        router.push(redirectPath);
        return;
      }

      // Offline / Local Simulation Fallback (for testing / demo setups)
      const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
      const normalizedEmail = email.trim().toLowerCase();

      // Check seed demo operators
      if (
        normalizedEmail.includes("admin") ||
        normalizedEmail.includes("coordinator") ||
        normalizedEmail.includes("supervisor") ||
        normalizedEmail.includes("interviewer") ||
        isDemo
      ) {
        document.cookie = "kava_session=true; path=/; max-age=86400; SameSite=Lax";
        sessionStorage.removeItem("kava_login_attempts");
        sessionStorage.removeItem("kava_lockout_until");
        router.push(redirectPath);
        return;
      }

      throw new Error(
        "Supabase is not configured. Enable DEMO mode or configure NEXT_PUBLIC_SUPABASE_URL."
      );
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Field Operator Login"
      subtitle="Sign in to access assigned Enumeration Areas and submit KASSEP household surveillance surveys."
      footerContent={
        <div className="space-y-3">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <span className="text-foreground font-medium">
              Accounts are created only by an administrator.
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground/80 font-mono">
            Contact your LGA field supervisor or study coordinator to obtain access credentials.
          </p>
        </div>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2"
          >
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Lockout Banner */}
        {lockoutTimer > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2 font-mono">
            <Clock className="size-4 shrink-0" />
            <span>
              Login locked. Please wait <strong>{lockoutTimer}s</strong> before retrying.
            </span>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-foreground">
            Official Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="operator@dmaf-kassep.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || lockoutTimer > 0}
              className="pl-9 h-11 bg-card border-border text-sm rounded-xl focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-medium text-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || lockoutTimer > 0}
              className="pl-9 pr-10 h-11 bg-card border-border text-sm rounded-xl focus-visible:ring-primary"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || lockoutTimer > 0}
          className="w-full h-11 rounded-xl text-sm font-medium gap-2 shadow-xs transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Log in to Dashboard</span>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-foreground">Loading operator portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}

