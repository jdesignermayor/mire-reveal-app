"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel as FormFieldLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createUserMutation } from "@/mutations/admin.mutation";

const formSchema = z.object({
    fullName: z.string().min(2, "El nombre completo debe tener al menos 2 caracteres"),
    cedula: z.string().min(5, "La cédula debe tener al menos 5 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateUserPopupProps {
    children: React.ReactNode;
    onUserCreated?: () => void;
}

export function CreateUserPopup({ children, onUserCreated }: CreateUserPopupProps) {
    const createUser = createUserMutation();
    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            cedula: "",
            email: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            // TODO: Implement user creation logic
            
            // Simulate API call
            await createUser.mutateAsync({
                fullName: values.fullName,
                nit: values.cedula,
                email: values.email,
            });

            toast.success("Usuario creado exitosamente");
            form.reset();
            setOpen(false);
            onUserCreated?.();
        } catch (error) {
            toast.error("Error al crear usuario");
            console.error("Error creating user:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormFieldLabel>Nombre Completo</FormFieldLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Juan Pérez"
                                            {...field}
                                            disabled={createUser.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cedula"
                            render={({ field }) => (
                                <FormItem>
                                    <FormFieldLabel>Cédula</FormFieldLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123456789"
                                            {...field}
                                            type="number"
                                            disabled={createUser.isPending}
                                        />
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
                                    <FormFieldLabel>Correo Principal</FormFieldLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            {...field}
                                            disabled={createUser.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={createUser.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={createUser.isPending}
                            >
                                {createUser.isPending ? "Creando..." : "Crear Usuario"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
