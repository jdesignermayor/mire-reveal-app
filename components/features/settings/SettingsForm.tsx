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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Clipboard, FileText, Layers, Mail, Phone, Plus, User } from "lucide-react";

const teams = [
  { label: "Equipo A", value: "team_a" },
  { label: "Equipo B", value: "team_b" },
  { label: "Equipo C", value: "team_c" },
];

const formSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  phone: z.coerce.string().min(7, "Teléfono inválido"),
  nit: z.coerce.string().min(5, "NIT inválido"),
  team: z.string().min(1, "Selecciona un equipo"),
  logo: z.instanceof(File).optional(),
  watermark: z.instanceof(File).optional(),
  plan: z.enum(["free", "pro"]),
});

export type FormValues = z.input<typeof formSchema>;

export default function SettingsForm() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            nit: "",
            team: "",
            plan: "free",
        },
    });

    const onSubmit = (values: FormValues) => {
        console.log("Formulario enviado:", values);
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
                                    <Input {...field} type="email" placeholder="correo@ejemplo.com" />
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
                <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Clipboard className="w-4 h-4" /> Logo
                                </FormLabel>
                                <FormControl>
                                    <label className="cursor-pointer flex items-center gap-2 border border-dashed border-gray-300 rounded-md p-3 hover:bg-gray-50 transition-colors">
                                        <span>{field.value?.name || "Selecciona un archivo"}</span>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => field.onChange(e.target.files?.[0])}
                                        />
                                    </label>
                                </FormControl>
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
                                    <label className="cursor-pointer flex items-center gap-2 border border-dashed border-gray-300 rounded-md p-3 hover:bg-gray-50 transition-colors">
                                        <span>{field.value?.name || "Selecciona un archivo"}</span>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => field.onChange(e.target.files?.[0])}
                                        />
                                    </label>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Equipo con botón para gestionar */}
                <div className="grid sm:grid-cols-2 gap-6 items-end">
                    <FormField
                        control={form.control}
                        name="team"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Layers className="w-4 h-4" /> Equipo
                                </FormLabel>
                                <div className="flex gap-2">
                                    <Select onValueChange={field.onChange} value={field.value} className="flex-1">
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un equipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {teams.map((team) => (
                                                <SelectItem key={team.value} value={team.value}>
                                                    {team.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" className="flex items-center gap-1">
                                        <Plus className="w-4 h-4" /> Gestionar
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

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
                                    className={`px-4 py-2 rounded-md border ${
                                        field.value === "free"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                    onClick={() => field.onChange("free")}
                                >
                                    Free
                                </button>
                                <button
                                    type="button"
                                    className={`px-4 py-2 rounded-md border ${
                                        field.value === "pro"
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

                <Button type="submit" className="w-full sm:w-48 mt-4">
                    Guardar información
                </Button>
            </form>
        </Form>
    );
}
