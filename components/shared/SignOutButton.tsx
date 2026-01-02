import { onSignOut } from "@/lib/auth.utils";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function SignOutButton(){
    const route = useRouter();

    const handleSignOut = () => {
        onSignOut();
        route.push("/login");
    }

    return <Button variant={"outline"} className="w-full cursor-pointer"  onClick={handleSignOut}>
        <PlusIcon />
        Cerrar sesión
    </Button>
}