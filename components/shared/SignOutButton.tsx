import { onSignOut } from "@/lib/auth.utils";
import { Button } from "../ui/button";

export default function SignOutButton(){
    return <Button onClick={onSignOut}>Cerrar sesion</Button>
}