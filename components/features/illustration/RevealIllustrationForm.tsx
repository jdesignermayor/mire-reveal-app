"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { LoadImagesButton } from "@/components/shared/LoadImagesButton";
import { getProfilesQuery } from "@/mutations/profiles.mutation";
import { Profile } from "@/models/profile.model";
import { createIllustration } from "@/actions/illustrations";
import { toast } from "sonner";
import { useState } from "react";

/* ------------------ Schema ------------------ */

const imageSchema = z.object({
    name: z.string(),
    base64: z.string().optional(),
    path: z.string().optional(),
    isUploaded: z.boolean().optional(),
});

const formSchema = z.object({
    profileId: z.string().nonempty("Profile is required."),
    name: z.string().nonempty("Name is required."),
    description: z.string().optional(),
    gestationalWeek: z.string().nonempty("Gestational week is required."),
    etnicity: z.enum([
        "asian",
        "black",
        "hispanic",
        "middle-eastern",
        "native",
        "pacific",
        "white",
        "mixed",
        "other",
    ]),
    images: z
        .array(imageSchema)
        .min(1, { message: "At least one image is required." }),
});

export type IllustrationFormData = z.infer<typeof formSchema>;

export default function RevealIllustrationForm() {
    const { data } = getProfilesQuery();
    const profiles = data?.profiles;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profileId: "",
            name: "",
            description: "",
            gestationalWeek: "26",
            etnicity: "hispanic",
            images: [],
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // TODO: Implement actual submission logic
            console.log("Submitting illustration:", values);
            await createIllustration(values);
            toast.success("Ecografía hiperrealista cargada correctamente, espere a que se procese...");
        } catch (error) {
            console.error("Error submitting illustration:", error);
            toast.error("Error al cargar la ecografía");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-xl space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Images */}
                    <FormField
                        control={form.control}
                        name="images"
                        render={() => (
                            <FormItem>
                                <FormLabel>Imágenes</FormLabel>
                                <FormControl className="hidden">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        id="images"
                                        multiple
                                    />
                                </FormControl>
                                <div className="flex gap-2 min-h-[30dvh]">
                                    <LoadImagesButton
                                        fieldId="images"
                                        multiple={true}
                                        setValue={form.setValue}
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Profile selector */}
                    <FormField
                        control={form.control}
                        name="profileId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Seleccionar el perfil</FormLabel>

                                <div className="flex gap-2">
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un perfil" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {profiles?.length > 0 && profiles?.map((profile: Profile) => (
                                                <SelectItem
                                                    key={profile.id}
                                                    value={profile.id.toString()}
                                                >
                                                    {profile.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button asChild type="button" variant="link">
                                        <Link href="/dashboard/profiles/create">
                                            Crear nuevo perfil
                                        </Link>
                                    </Button>
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del bebé</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del bebé" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción de la ilustración (Opcional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Descripción de la ilustración (Opcional)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Gestational Week + Ethnicity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Gestational Week */}
                        <FormField
                            control={form.control}
                            name="gestationalWeek"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Semana gestacional</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona semana" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectItem value="26">
                                                26 Semanas (recomendado)
                                            </SelectItem>
                                            <SelectItem value="27">27 Semanas</SelectItem>
                                            <SelectItem value="28">28 Semanas</SelectItem>
                                            <SelectItem value="29">29 Semanas</SelectItem>
                                            <SelectItem value="30">30 Semanas</SelectItem>
                                            <SelectItem value="31">31 Semanas</SelectItem>
                                            <SelectItem value="32">32 Semanas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Ethnicity */}
                        <FormField
                            control={form.control}
                            name="etnicity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Etnia</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona etnia" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectItem value="asian">Asiático</SelectItem>
                                            <SelectItem value="black">
                                                Negro / Africano
                                            </SelectItem>
                                            <SelectItem value="hispanic">
                                                Hispano / Latino
                                            </SelectItem>
                                            <SelectItem value="middle-eastern">
                                                Medio Oriente
                                            </SelectItem>
                                            <SelectItem value="native">
                                                Nativo / Indígena
                                            </SelectItem>
                                            <SelectItem value="white">Blanco</SelectItem>
                                            <SelectItem value="mixed">Mixto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        {isSubmitting ? "Cargando..." : "Cargar"}
                    </Button>
                </form>
            </Form>

            <p className="text-xs text-muted-foreground">
                Las imágenes generadas son ficticias y no deben usarse con fines médicos
                o diagnósticos. Los resultados son generados automáticamente y pueden
                contener contenido ofensivo, inapropiado, irreal u objetable por error.
            </p>
        </div>
    );
}
