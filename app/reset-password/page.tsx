"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isForced = searchParams.get("force") === "true";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
          data: { must_change_password: false },
        });

        if (error) {
          throw new Error(error.message);
        }
      }

      setSuccess(true);
      document.cookie = "kava_session=true; path=/; max-age=86400; SameSite=Lax";
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isForced ? "Set Permanent Password" : "Create New Password"}
      subtitle={
        isForced
          ? "You were issued a temporary password by an administrator. Please set a secure permanent password to continue."
          : "Please specify a strong, memorable password for your KaVa operator account."
      }
      footerContent={
        <Link
          href="/login"
          className="text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          Cancel and return to login
        </Link>
      }
    >
      {success ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-3">
          <CheckCircle2 className="size-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Password Updated</h4>
            <p className="leading-relaxed">
              Your password has been securely updated. Redirecting you to the KaVa dashboard...
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {isForced && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-xs flex items-start gap-2.5">
              <ShieldAlert className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="leading-relaxed text-muted-foreground">
                <strong className="text-foreground">First Login Requirement:</strong> For security, temporary credentials must be replaced with your own password.
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-xs font-medium text-foreground">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
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

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="pl-9 pr-10 h-11 bg-card border-border text-sm rounded-xl focus-visible:ring-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl text-sm font-medium gap-2 shadow-xs transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Save & Continue to Dashboard</span>
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-foreground">Loading password recovery...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

