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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createCompanyMutation, updateCompanyMutation } from "@/mutations/admin.mutation";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    phone: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
    nit: z.string().min(5, "El NIT debe tener al menos 5 caracteres"),
    billingPlan: z.string().min(1, "Debe seleccionar un plan de facturación"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCompanyPopupProps {
    children: React.ReactNode;
    onCompanyCreated?: () => void;
    company?: {
        id: string;
        name: string;
        email: string;
        phone: string;
        nit: string;
        billingPlan: string;
    };
}

export function CreateCompanyPopup({ children, onCompanyCreated, company }: CreateCompanyPopupProps) {
    const [open, setOpen] = useState(false);
    const isEditing = !!company;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: company?.name || "",
            email: company?.email || "",
            phone: company?.phone || "",
            nit: company?.nit || "",
            billingPlan: company?.billingPlan || "",
        },
    });

    const createCompany = createCompanyMutation();
    const updateCompany = updateCompanyMutation();

    const onSubmit = async (values: FormValues) => {
        try {
            if (isEditing && company) {
                await updateCompany.mutateAsync({
                    id: company.id,
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    nit: values.nit,
                    billingPlan: values.billingPlan,
                });
                toast.success("Compañía actualizada exitosamente");
            } else {
                await createCompany.mutateAsync({
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    nit: values.nit,
                    billingPlan: values.billingPlan,
                });
                toast.success("Compañía creada exitosamente");
            }
            
            form.reset();
            setOpen(false);
            onCompanyCreated?.();
        } catch (error) {
            toast.error(isEditing ? "Error al actualizar la compañía" : "Error al crear la compañía");
            console.error("Error:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Compañía" : "Crear Nueva Compañía"}</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormFieldLabel>Nombre de la Compañía</FormFieldLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Empresa S.A."
                                            {...field}
                                            disabled={createCompany.isPending}
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
                                    <FormFieldLabel>Correo Electrónico</FormFieldLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="empresa@ejemplo.com"
                                            {...field}
                                            disabled={createCompany.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormFieldLabel>Teléfono</FormFieldLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="+57 300 123 4567"
                                            {...field}
                                            disabled={createCompany.isPending}
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
                                    <FormFieldLabel>NIT</FormFieldLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123456789-0"
                                            {...field}
                                            disabled={createCompany.isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="billingPlan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormFieldLabel>Plan de Facturación</FormFieldLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar plan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="basic">Básico</SelectItem>
                                            <SelectItem value="standard">Estándar</SelectItem>
                                            <SelectItem value="premium">Premium</SelectItem>
                                            <SelectItem value="enterprise">Enterprise</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={createCompany.isPending || updateCompany.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={createCompany.isPending || updateCompany.isPending}
                            >
                                {(createCompany.isPending || updateCompany.isPending) 
                                    ? (isEditing ? "Actualizando..." : "Creando...") 
                                    : (isEditing ? "Actualizar Compañía" : "Crear Compañía")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
