"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { getCompanies } from "@/mutations/admin.mutation";

const formSchema = z.object({
    companyId: z.string().min(1, "Debe seleccionar una compañía"),
});

type FormValues = z.infer<typeof formSchema>;

interface AssignCompanyPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
    userEmail: string;
    onAssign: (companyId: string) => void;
    isAssigning?: boolean;
}

export function AssignCompanyPopup({ 
    open, 
    onOpenChange, 
    userId, 
    userEmail, 
    onAssign,
    isAssigning = false 
}: AssignCompanyPopupProps) {
    const getCompaniesQuery = getCompanies();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyId: "",
        },
    });

    const onSubmit = (values: FormValues) => {
        onAssign(values.companyId);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Asignar Usuario a Compañía</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Usuario</p>
                        <p className="text-sm text-gray-600">{userEmail}</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="companyId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormFieldLabel>Seleccionar Compañía</FormFieldLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar compañía" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getCompaniesQuery.data?.companies?.map((company: any) => (
                                                    <SelectItem key={company.id} value={company.id.toString()}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
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
                                    onClick={() => onOpenChange(false)}
                                    disabled={isAssigning}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isAssigning}
                                >
                                    {isAssigning ? "Asignando..." : "Asignar"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
