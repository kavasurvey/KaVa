"use client";

import { useState } from "react";
import { UserRound, Shield, Check, Wifi, LogOut, Download, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { surveySyncService } from "@/lib/db/sync";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Expose install prompt globally so ProfileMenu can read it
declare global {
  interface Window {
    __kavaInstallPrompt?: BeforeInstallPromptEvent;
  }
}

export function ProfileMenu({
  placement,
  className,
}: {
  placement: "sidebar" | "topbar";
  className?: string;
}) {
  const { user, role, setRole, language, setLanguage, signOut } = useAuth();
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  // Unsynced sign-out guard
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);

  // Install state
  const [canInstall, setCanInstall] = useState(false);

  // Check if the global install prompt exists (set by PwaManager)
  const checkInstallAvailable = () => {
    setCanInstall(typeof window !== "undefined" && !!window.__kavaInstallPrompt);
  };

  const handleSignOutClick = async () => {
    try {
      const { hasUnsynced, pendingCount: pc, draftCount: dc } =
        await surveySyncService.hasUnsyncedData();
      if (hasUnsynced) {
        setPendingCount(pc);
        setDraftCount(dc);
        setSignOutDialogOpen(true);
        return;
      }
    } catch {
      // If we can't check, proceed safely
    }
    await doSignOut();
  };

  const doSignOut = async () => {
    try {
      await surveySyncService.clearLocalDataSafe();
    } catch {}
    await signOut();
    document.cookie = "kava_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    document.cookie = "kava_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    try {
      localStorage.removeItem("kava_user_session");
    } catch {}
    window.location.href = "/login";
  };

  const handleInstallClick = async () => {
    const prompt = window.__kavaInstallPrompt;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      window.__kavaInstallPrompt = undefined;
      setCanInstall(false);
    }
  };

  return (
    <>
      <DropdownMenu onOpenChange={(open) => open && checkInstallAvailable()}>
        <DropdownMenuTrigger
          aria-label="Open profile menu"
          title="Profile & Settings"
          className={cn(
            buttonVariants({
              variant: placement === "topbar" ? "outline" : "ghost",
              size: "icon-sm",
            }),
            "rounded-lg",
            placement === "sidebar" && "text-muted-foreground",
            className,
          )}
        >
          <UserRound aria-hidden="true" className="size-4 text-primary" strokeWidth={1.8} />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side={placement === "sidebar" ? "right" : "bottom"}
          align="end"
          sideOffset={8}
          className="w-68 bg-popover border-border text-popover-foreground shadow-md"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-semibold text-xs text-muted-foreground">
              Current Operator
            </DropdownMenuLabel>
            <div className="px-2 py-1.5">
              <div className="text-xs font-semibold text-foreground">{user.fullName}</div>
              <div className="text-[11px] text-muted-foreground font-mono">{user.email}</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  <Shield className="size-2.5" />
                  {role}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Phase 1 & 2
                </span>
              </div>
            </div>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <div className="px-2 py-1.5 font-mono text-[11px] text-muted-foreground flex items-center gap-2">
            <Wifi className="size-3 text-emerald-500" />
            <span>Local IndexedDB Ready (Kano)</span>
          </div>

          {/* Install App — shown when browser install prompt is available */}
          {canInstall && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleInstallClick}
                  className="w-full h-7 text-xs font-medium gap-1.5 justify-start border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Download className="size-3" aria-hidden="true" />
                  Install KaVa App
                </Button>
              </div>
            </>
          )}

          {/* Role switcher - only displayed if DEMO mode is enabled */}
          {isDemo && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-semibold text-[11px] text-muted-foreground">
                  Switch Role (Demo Simulation)
                </DropdownMenuLabel>
                {(["admin", "supervisor", "interviewer"] as const).map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => setRole(r)}
                    className="flex items-center justify-between text-xs capitalize cursor-pointer hover:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="size-3.5 text-primary" />
                      <span>{r}</span>
                    </div>
                    {role === r && <Check className="size-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-semibold text-[11px] text-muted-foreground">
              Language / Harshe
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setLanguage("en")}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-muted"
            >
              <span>English</span>
              {language === "en" && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage("ha")}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-muted"
            >
              <span>Hausa (KASSEP)</span>
              {language === "ha" && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleSignOutClick}
            className="flex items-center gap-2 text-xs text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="size-3.5" aria-hidden="true" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Unsynced Warning Dialog */}
      <AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
              Warning: Unsynced Surveys Detected
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              You have{" "}
              {pendingCount > 0 && (
                <strong className="text-foreground">
                  {pendingCount} unsynced completed survey{pendingCount > 1 ? "s" : ""}
                </strong>
              )}
              {pendingCount > 0 && draftCount > 0 && " and "}
              {draftCount > 0 && (
                <strong className="text-foreground">
                  {draftCount} active draft{draftCount > 1 ? "s" : ""}
                </strong>
              )}{" "}
              stored on this device. Signing out will clear local data and these surveys will be
              lost.{" "}
              <strong>Connect to the internet to synchronize before signing out.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="w-full sm:w-auto text-xs">
              Cancel — Keep Data Safe
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={doSignOut}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
            >
              Sign Out & Clear (Discard Data)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
