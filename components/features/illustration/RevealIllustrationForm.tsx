"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { createIllustration } from "@/actions/illustrations";
import { LoadImagesButton } from "@/components/shared/LoadImagesButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Illustration, ILLUSTRATION_STATUS } from "@/models/illustration.model";
import { Profile } from "@/models/profile.model";
import { getProfilesQuery } from "@/mutations/profiles.mutation";
import { resetIllustrationAtomState, UIIllustrationAtom } from "@/store/ui-illustration.store";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateIllustrationMutation } from "@/mutations/illustration.mutation";

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
    const router = useRouter();
    const { data } = getProfilesQuery();
    const profiles = data?.profiles;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const illustrationMutation = generateIllustrationMutation();

    const resetIllustrationState = useSetAtom(resetIllustrationAtomState);
    const [, setIllustration] = useAtom(UIIllustrationAtom);

    const handleRedirection = (illustration: Illustration) => {
        router.replace(`/dashboard/create-illustration/${illustration.id}`);
        setIllustration({
            illustration,
            updatedImages: [],
            updatedStatus: ILLUSTRATION_STATUS.PENDING,
        });
    };

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
            const illustration = await createIllustration(values);

            toast.success("Ecografía hiperrealista cargada correctamente, espere a que se procese...");

            illustrationMutation.mutate(illustration);
            handleRedirection(illustration);
        } catch (error) {
            console.error("Error submitting illustration:", error);
            toast.error("Error al cargar la ecografía");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        // Reset illustration atom state when component mounts
        resetIllustrationState();

        // Cleanup function when component unmounts
        return () => {
            resetIllustrationState();
        };
    }, [resetIllustrationState]);

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
                                <FormLabel>Images</FormLabel>
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
                Generated images are fictional and should not be used for medical
                or diagnostic purposes. Results are automatically generated and may
                contain offensive, inappropriate, unrealistic, or objectionable content by error.
            </p>
        </div>
    );
}
