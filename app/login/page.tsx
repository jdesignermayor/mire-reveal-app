"use client";

import { Suspense } from "react";
import { ImageCarousel } from "@/components/shared/ImageCarousel";
import { LoginForm } from "@/components/shared/LoginForm";

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <ImageCarousel />
      <Suspense fallback={<div>Loading...</div>}>
        <LoginFormWrapper />
      </Suspense>
    </div>
  )
}
