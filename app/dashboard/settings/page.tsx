import SettingsForm from "@/components/features/settings/SettingsForm";

export default function SettingsPage(){
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
                    <SettingsForm />
                </div>
            </div>
        </section>
}