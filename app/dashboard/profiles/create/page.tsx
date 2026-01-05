import ProfileDetailBreadcrumb from "@/components/features/profiles/ProfileDetailBreadcrumb";
import ProfileForm from "@/components/features/profiles/ProfileForm";

export default function CreateProfilePage(){
    return <section className="p-6">
        <div className="grid gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <ProfileDetailBreadcrumb />
                    <h1 className="text-4xl font-bold">Crear perfil</h1>
                </div>
           
            </div>
            <ProfileForm />
        </div>
    </section>
}