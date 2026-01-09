import { getProfileById } from "@/actions/profiles";
import ProfileDetailBreadcrumb from "@/components/features/profiles/ProfileDetailBreadcrumb";
import ProfileForm from "@/components/features/profiles/ProfileForm";

export default async function EditProfilePage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    const profileData = await getProfileById(id);

    if(!profileData){
        return <p>No hay info...</p>
    }
    
    return <section className="p-6">
            <div className="grid gap-8">
                <div className="flex justify-between items-center">
                    <div>
                        <ProfileDetailBreadcrumb />
                        <h3 className="text-4xl font-bold">Editar perfil</h3>
                    </div>
                </div>
                <ProfileForm profile={profileData} />
            </div>
        </section>
}