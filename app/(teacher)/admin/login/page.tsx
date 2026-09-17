"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (!res?.ok || res?.error) {
        setError("Invalid teacher credentials. Please check your email and password.");
        toast.error("Login failed. Verify credentials.");
      } else {
        toast.success("Welcome back.");
        window.location.href = "/admin";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-sm space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Student Portal
        </Link>

        <Card className="border-border rounded-lg shadow-sm">
          <CardHeader className="text-left pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-foreground mb-2">
              <Lock className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Teacher Portal Login
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Enter your credentials to manage curriculum materials and student inquiries.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Teacher Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="teacher@tap2read.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-9 text-xs"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-medium text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="default"
                className="w-full text-xs gap-2 mt-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="rounded-md border border-border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Teacher Account Credentials</p>
          <p className="mt-0.5 font-mono text-[11px]">teacher@tap2read.com</p>
          <p className="font-mono text-[11px]">tap2read@teacher</p>
        </div>
      </div>
    </div>
  );
}
