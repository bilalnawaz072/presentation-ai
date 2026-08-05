"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      // Automatically sign in after successful signup
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl: "/",
      });

      if (signInRes?.ok) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/auth/signin?registered=true");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 font-sans text-slate-100">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-pink-600/10 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md border border-slate-800/80 bg-slate-900/90 shadow-2xl backdrop-blur-xl transition-all">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Create an Account
            </CardTitle>
            <CardDescription className="text-slate-400">
              Join Presentation AI to start generating presentations
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs sm:text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Name / Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/30"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-medium py-2.5 rounded-lg shadow-lg hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center gap-3 pt-2 text-slate-400">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-purple-400 hover:text-purple-300 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
