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
    <div className="flex items-center justify-center p-8 lg:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col space-y-3 gap-3">
          <div className="flex flex-col gap-3">
            <Image src="/logo.svg" alt="Logo" width={120} height={100} priority={true} />
            <p className="text-muted-foreground leading-relaxed">Hyper-realistic ultrasound generator, AI trained on real medical data.</p>
          </div>
          <div>
            <h1 className="text-4xl font-serif tracking-tight text-foreground">Sign in</h1>
            <p className="text-muted-foreground leading-relaxed">Enter your credentials to access your account.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              {/* <a href="#" className="text-sm text-primary hover:underline underline-offset-4">
                Recordar contrasena?
              </a> */}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md px-4 py-3"
            >
              {error}
            </p>
          )}
          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
              Recordar este dispositivo
            </label>
          </div> */}

          <Button type="submit" className="w-full h-12 text-base font-medium bg-[#A565FF] hover:bg-[#8052cc]">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}
