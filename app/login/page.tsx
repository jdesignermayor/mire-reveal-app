import { ImageCarousel } from "@/components/shared/ImageCarousel";
import { LoginForm } from "@/components/shared/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <ImageCarousel />
      <LoginForm />
    </div>
  )
}
