"use client";

import { ClientDataTable } from '@/components/shared/ClientDataTable';
import { Button } from '@/components/ui/button';
import { deleteCompanyMutation, getCompanies } from '@/mutations/admin.mutation';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useMemo } from 'react';

type Company = {
    id: number;
    name: string;
    nit: string;
    created_at: string;
    is_active: boolean;
};

export function CompaniesTable() {
    const getCompaniesQuery = getCompanies();
    const [deletingCompanyId, setDeletingCompanyId] = useState<number | null>(null);
    const deleteCompany = deleteCompanyMutation();

    const columns = useMemo<ColumnDef<Company>[]>(() => [
        {
            accessorKey: "name",
            header: "Company Name",
            size: 200,
        },
        {
            accessorKey: "nit",
            header: "NIT",
            size: 150,
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            size: 120,
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"));
                return date.toLocaleDateString();
            },
        },
        {
            accessorKey: "is_active",
            header: "Status",
            size: 100,
            cell: ({ row }) => {
                const isActive = row.getValue("is_active");
                return isActive ? "✅ Active" : "❌ Inactive";
            },
        },
        {
            accessorKey: "options",
            header: "Options",
            size: 200,
            cell: ({ row }) => {
                const companyId = row.original?.id;
                const isDeletingThisCompany = deletingCompanyId === companyId;
                
                return (
                    <div className="flex gap-2">
                        <Button className="btn btn-sm btn-primary">Edit</Button>
                        <Button 
                            variant={'outline'} 
                            className="btn btn-sm btn-error" 
                            onClick={() => handleDeleteCompany(companyId)}
                            disabled={isDeletingThisCompany}
                        >
                            {isDeletingThisCompany ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </div>
                );
            },
        },
    ], [deletingCompanyId]);

    const handleDeleteCompany = async (companyId: number) => {
        setDeletingCompanyId(companyId);
        try {
            console.log('Deleting company:', companyId);
            // TODO: Implement delete company mutation
            await deleteCompany.mutateAsync(companyId.toString());
            await getCompaniesQuery.refetch();
        } catch (error) {
            console.error('Error deleting company:', error);
        } finally {
            setDeletingCompanyId(null);
        }
    };

    return <div>
        <ClientDataTable columns={columns} data={getCompaniesQuery.data?.companies || []} />
    </div>;
}
