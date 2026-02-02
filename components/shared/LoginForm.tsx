"use client"

import type React from "react"

import { getSettings } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabaseBrowser } from "@/lib/supabase/client"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function LoginForm() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Login attempt:", { email, password, rememberMe })
    // Add your login logic here
    handleLogin({ email, password })
  }

  const handleLoginError = async () => {
    setError('Error signing in, please verify your credentials and contact the administrator.');
    await supabase.auth.signOut();
    setIsLoading(false);
  }

  async function handleLogin({ email, password }: { email: string; password: string }) {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data?.session) {
      const settings = await getSettings();

      if (!settings?.company) {
        await handleLoginError();
        return;
      }
      setError(null);
      router.replace(redirectPath);
    } else {
      await supabase.auth.signOut();
      await handleLoginError();
      return;
    }

    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Glass morphism card */}
        <div className="backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
                  <Image 
                    src="/logo.svg" 
                    alt="Logo" 
                    width={80} 
                    height={67} 
                    priority={true}  
                    className="brightness-0 dark:brightness-100" 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-poppins">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Sign in to access your ultrasound generator
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-4 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-4 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/10 rounded-lg blur-sm"></div>
                <div className="relative bg-red-50/80 dark:bg-red-950/50 border border-red-200/50 dark:border-red-800/50 rounded-lg p-4">
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold  rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hyper-realistic ultrasound generator powered by AI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
