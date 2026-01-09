"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createProfileMutation, updateProfileMutation } from "@/mutations/getprofiles.mutation";
import { Calendar, FileText, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { Profile } from "@/models/profile.model";

const formSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.coerce
    .number()
    .min(0, "Age must be a positive number")
    .max(150),
  doc: z.coerce
    .string()
    .min(1, "Document number must be a positive number"),
  phone: z.coerce
  .string()
  .min(7, "Phone number must be at least 7 digits"),
  email: z.email("Invalid email address"),
});

export type TypeProfileValuesForm = z.input<typeof formSchema>;

export default function ProfileForm({ profile }: { profile?: Profile }) {
    const isEditing = profile ? true : false;
    const upsertProfile = updateProfileMutation();
    const insertProfile = createProfileMutation();
    const isLoading = upsertProfile.isPending || insertProfile.isPending;
    const createdSuccesfully = insertProfile.isSuccess;

    const defaultValuesProfile = {
        name: profile?.name || "",
        age: profile?.age || "",
        doc: profile?.doc || "",
        phone: profile?.phone || "",
        email: profile?.email
    }

    const form = useForm<z.input<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: isEditing ? defaultValuesProfile : {
            name: "",
            age: "",
            doc: null,
            phone: "",
            email: "",
        },
    });

    const onUpdateProfile = (profileFormValues: z.input<typeof formSchema>) => {
        const completedProfile = {
            ...profile,
            ...profileFormValues
        } as Profile;

        upsertProfile.mutate(completedProfile);
        
        if(insertProfile.isError){
            toast.error("Error al actualizar, verifica los datos.")
        }
        toast.success("Perfil actualizado correctamente.");
    }

    const onSubmit = (values: z.input<typeof formSchema>) => {
        if(isEditing){
            onUpdateProfile(values)
            return;
        }

        insertProfile.mutate(values);

        if(insertProfile.isError){
            toast.error("Error al crear, verifica los datos.")
            return;
        }
        
        toast.success("Perfil creado correctamente.");
        return;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Nombre completo
                        </FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="John Doe" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Edad
                        </FormLabel>
                        <FormControl>
                        <Input
                            {...field}
                            type="number"
                            placeholder="25"
                            value={field.value as number ?? ""}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="doc"
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        # Documento
                        </FormLabel>
                        <FormControl>
                        <Input
                            {...field}
                            type="number"
                            placeholder="123456789"
                            value={field.value as number ?? ""}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Teléfono
                    </FormLabel>
                    <FormControl>
                        <Input {...field} value={field.value as string}type="tel" placeholder="+57 000-0000" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Correo electrónico
                    </FormLabel>
                    <FormControl>
                        <Input {...field} type="email" placeholder="john@example.com" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button disabled={isLoading || createdSuccesfully} className="w-48 cursor-pointer hover:opacity-80" type="submit">{isLoading ? 'Enviando informacion...' : 'Enviar' }</Button>
            </form>
        </Form>
    );
}
