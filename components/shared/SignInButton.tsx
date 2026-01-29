
import { getAuthData } from "@/lib/auth.utils";
import Link from "next/link";
import { Button } from "../ui/button";

export default async function SignInButton() {
    const { isAuthenticated } = await getAuthData();
    return isAuthenticated ? <Link href="/dashboard"><Button>Ir al perfil</Button></Link> : <Link href="/login"><Button variant={'outline'}>Sign in</Button></Link>
}