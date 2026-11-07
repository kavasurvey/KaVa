"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const origin = window.location.origin;
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${origin}/reset-password`,
        });

        if (error) {
          throw new Error(error.message);
        }
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate password recovery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter the verified email linked to your KaVa operator account. We will send a secure password reset link."
      footerContent={
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to Operator Login</span>
        </Link>
      }
    >
      {success ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-3">
            <CheckCircle2 className="size-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Recovery Link Dispatched</h4>
              <p className="leading-relaxed">
                If an account exists with <strong className="font-mono">{email}</strong>, a reset link has been dispatched. Please check your inbox and spam folder.
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Did not receive the email? Check with your study coordinator or try again in a few moments.
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={() => setSuccess(false)}
            className="w-full h-10 rounded-xl text-xs"
          >
            Send to a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
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
                disabled={loading}
                className="pl-9 h-11 bg-card border-border text-sm rounded-xl focus-visible:ring-primary"
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
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <span>Send Password Reset Link</span>
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

