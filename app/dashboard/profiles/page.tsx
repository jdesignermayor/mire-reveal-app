import { getProfiles } from "@/actions/profiles";
import { ProfileListTable } from "@/components/features/profiles/ProfileListTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilesPage(){

    
    const profiles = await getProfiles();
    
    return <section className="p-6">
        <div className="grid gap-8">
            <div className="flex justify-between items-center">
               <div>
                    <h3 className="text-4xl font-bold">Perfiles</h3>
                    <p className="text-muted-foreground leading-relaxed">
                    Aqui podras ver los perfiles recientes, filtrarlos y gestionarlos.
                    </p>
               </div>
                <Link href="/dashboard/profiles/create">
                    <Button className=" cursor-pointer">
                        Crear perfil
                    </Button>
                </Link>
            </div>
            <section className="flex gap-4">
                <ProfileListTable data={profiles} />
            </section>
        </div>
    </section>
}