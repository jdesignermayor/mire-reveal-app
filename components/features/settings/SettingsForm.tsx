"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


import { GetSettingsType, updateSettings } from "@/actions/settings";
import { Clipboard, FileText, Layers, Mail, Phone, Plus, User } from "lucide-react";
import { LoadImagesButton } from "@/components/shared/LoadImagesButton";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(2, "El nombre es obligatorio"),
    email: z.email("Email inválido"),
    phone: z.string().optional(),
    nit: z.string().optional(),
    logo: z.string().nullable(),
    watermark: z.string().nullable().optional(),
    plan: z.enum(["free", "pro"]),
});

export type SettingsFormValues = z.input<typeof formSchema>;

export default function SettingsForm({ settings }: { settings: GetSettingsType }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: settings.company.name || "",
            email: settings.user.email || "",
            phone: settings.company.phone?.toString() || "",
            nit: settings.company.nit || "",
            plan: "free",
            watermark: settings.company.watermark_url || "",
            logo: settings.company.logo_url || "",
        },
    });

    const onSubmit = async (values: SettingsFormValues) => {
        setIsLoading(true);
        if (!settings.company.uuid_company) {
            return;
        }

      try {
        await updateSettings({ settingFormValues: values, uuid_company: settings.company.uuid_company });
        toast.success("Configuración actualizada correctamente.");
       
        router.push("/dashboard");
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mx-auto"
            >
                {/* Nombre y Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <User className="w-4 h-4" /> Nombre
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nombre de la empresa" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email principal
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" placeholder="correo@ejemplo.com" disabled={true} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Teléfono y NIT */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> Teléfono
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="tel"
                                        value={field.value ?? ""}
                                        placeholder="+57 300 000 0000"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> NIT
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value ?? ""} placeholder="123456789" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Logo y Marca de agua */}
                <div className="grid sm:grid-cols-2 gap-6 ">
                    <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Clipboard className="w-4 h-4" /> Logo
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="logo-field"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </FormControl>
                                <div className="flex gap-5">
                                    <div >
                                        <p>Actual</p>
                                        <Image
                                            src={settings.logo_public_url ?? '/empty-image.jpg'}
                                            alt="image"
                                            placeholder="blur"
                                            blurDataURL="/empty-image.jpg"
                                            priority={false}
                                            width={240}
                                            height={240}
                                            className="w-40 h-40 object-cover rounded-full border"
                                        />
                                    </div>
                                    <div>
                                        <p>Cambiar</p>
                                        <LoadImagesButton multiple={false} isAsset={true} onUpload={(path) => {
                                            field.onChange(path);
                                        }} fieldId="logo-field" />
                                    </div>

                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="watermark"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Clipboard className="w-4 h-4" /> Marca de agua
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="watermark-field"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                    />
                                </FormControl>
                                <div className="flex gap-5">
                                    <div>
                                        <p>Actual</p>
                                        <Image
                                            src={settings.watermark_public_url ?? '/empty-image.jpg'}
                                            placeholder="blur"
                                            blurDataURL="/empty-image.jpg"
                                            priority={false}
                                            alt="image"
                                            width={240}
                                            height={240}
                                            className="w-40 h-40 object-cover rounded-full border"
                                        />
                                    </div>
                                    <div>
                                        <p>Cambiar</p>
                                        <LoadImagesButton multiple={false} isAsset={true} fieldId="watermark-field" onUpload={(path) => {
                                            field.onChange(path);
                                        }} />
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Equipo con botón para gestionar */}
                {/* <div className="grid gap-6 items-end">
                    <p className="flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Equipo
                    </p>
                    <Button variant="outline" type="button" className="flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Gestionar
                    </Button>
                </div> */}

                {/* Plan */}
                <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Plan actual
                            </FormLabel>
                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    type="button"
                                    className={`px-4 py-2 rounded-md border ${field.value === "free"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                    onClick={() => field.onChange("free")}
                                >
                                    Free
                                </button>
                                <button
                                    type="button"
                                    className={`px-4 py-2 rounded-md border ${field.value === "pro"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                    onClick={() => field.onChange("pro")}
                                >
                                    Pro 🚀
                                </button>
                            </div>
                        </FormItem>
                    )}
                />

                <Button disabled={isLoading} type="submit" className="w-full sm:w-48 mt-4">
                    {isLoading ? 'Guardando...' : 'Guardar información'}
                </Button>
            </form>
        </Form>
    );
}
