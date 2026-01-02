"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabaseBrowser } from "@/lib/supabase/client"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Login attempt:", { email, password, rememberMe })
    // Add your login logic here
    handleLogin({ email, password })
  }

    async function handleLogin({ email, password }: { email: string; password: string }) {
      setIsLoading(true);
        const supabase = supabaseBrowser();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (data?.session) {
        router.replace(redirectPath); // 🚀 redirect after login
        } else {
        // alert(error.message);
        }

        setIsLoading(false);
    }

  return (
    <div className="flex items-center justify-center p-8 lg:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col space-y-3 gap-3">
          <div className="flex flex-col gap-3">
              <Image src="/logo.svg" alt="Logo" width={120} height={100} priority={true} />
              <p className="text-muted-foreground leading-relaxed">Generador de ecografias hiperrealistas, AI entrenada en datos medicos reales.</p>
          </div>
          <div>
            <h1 className="text-4xl font-serif tracking-tight text-foreground">Iniciar sesion</h1>
            <p className="text-muted-foreground leading-relaxed">Ingresa tus credenciales para acceder a tu cuenta.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
             Correo electronico
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
                Contrasena
              </Label>
              <a href="#" className="text-sm text-primary hover:underline underline-offset-4">
               Recordar contrasena?
              </a>
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
              Recordar este dispositivo
            </label>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-medium bg-[#A565FF] hover:bg-[#8052cc]">
            {isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
          </Button>
        </form>
      </div>
    </div>
  )
}
