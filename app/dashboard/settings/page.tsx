import { getSettings } from "@/actions/settings";
import SettingsForm from "@/components/features/settings/SettingsForm";

export default async function SettingsPage(){
    const settings = await getSettings();
    
    if(!settings){
        return;
    }

    return <section className="p-6">
            <div className="grid gap-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold">Configuracion</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            Aqui podras configurar tu perfil y marca de agua.
                        </p>
                    </div>
                </div>
                <div>
                    <SettingsForm settings={settings} />
                </div>
            </div>
        </section>
}