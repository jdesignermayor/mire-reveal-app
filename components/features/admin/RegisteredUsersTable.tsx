"use client";

import { NO_COMPANY_ID, UserWithComputed } from '@/app/api/user/route';
import { ClientDataTable } from '@/components/shared/ClientDataTable';
import { Button } from '@/components/ui/button';
import { deleteUserMutation, getRegisteredUsers, assignCompanyMutation } from '@/mutations/admin.mutation';
import { AssignCompanyPopup } from './AssignCompanyPopup';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useMemo } from 'react';


export function RegisteredUsersTable() {
    const deleteUnallowedUserMutation = deleteUserMutation();
    const getRegisteredUsersQuery = getRegisteredUsers();
    const assignCompany = assignCompanyMutation();

    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
    const [assignPopupOpen, setAssignPopupOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);
    
    const columns = useMemo<ColumnDef<UserWithComputed>[]>(() => [
        {
            accessorKey: "email",
            header: "Email",
            size: 250,
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
            accessorKey: "email_confirmed_at",
            header: "Email Confirmed",
            size: 140,
            cell: ({ row }) => {
                const confirmed = row.getValue("email_confirmed_at");
                return confirmed ? "✅ Yes" : "❌ No";
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            size: 100,
            cell: ({ row }) => {
                const role = row.getValue("role") || "";
                return role;
            },
        },
        {
            accessorKey: "companyName",
            header: "Company Name",
            size: 150,
            cell: ({ row }) => {
                const companyName = row.getValue("companyName") || "";
                return companyName;
            },
        },
        {
            accessorKey: "options",
            header: "Options",
            size: 800,
            cell: ({ row }) => {
                // @ts-expect-error expetex ts error, ignore for now TODO: Fix this type 
                const userId = row.original?.uuid_user || "";
                const userEmail = row.original?.email || "";
                const isCompanyAssigned = row.getValue("companyName") !== "NO_COMPANY";
                const isDeletingThisUser = deletingUserId === userId;
                const isAssigningThisUser = assigningUserId === userId;
                
                return (
                    <div className="flex gap-2">
                       {!isCompanyAssigned && (
                       <Button 
                            className="btn btn-sm btn-primary" 
                            onClick={() => handleAssignCompany({ uuid_user: userId, email: userEmail })}
                            disabled={isAssigningThisUser}
                        >
                            {isAssigningThisUser ? "Asignando..." : "Asignar Empresa"}
                        </Button>)}
                        {userId && <Button 
                            variant={'outline'} 
                            className="btn btn-sm btn-error" 
                            onClick={() => handleDeleteUser(userId)}
                            disabled={isDeletingThisUser}
                        >
                            {isDeletingThisUser ? "Eliminando..." : "Eliminar"}
                        </Button>}
                    </div>
                );
            },
        },
    ], [deletingUserId, assigningUserId]);

    const handleDeleteUser = async (userId: string) => {
        setDeletingUserId(userId);
        try {
            await deleteUnallowedUserMutation.mutateAsync(userId);
            await getRegisteredUsersQuery.refetch();
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleAssignCompany = ({ uuid_user, email }: { uuid_user: string; email: string }) => {
        setSelectedUser({ id: uuid_user, email });
        setAssignPopupOpen(true);
    };

    const handleAssignSubmit = async (companyId: string) => {
        if (!selectedUser) return;
        
        setAssigningUserId(selectedUser.id);
        try {
            await assignCompany.mutateAsync({
                companyId: companyId,
                userId: selectedUser.id,
                email: selectedUser.email
            });
            
            await getRegisteredUsersQuery.refetch();

            setAssignPopupOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error assigning user to company:', error);
        } finally {
            setAssigningUserId(null);
        }
    };

    return <div>
        <ClientDataTable columns={columns} data={getRegisteredUsersQuery.data?.users || []} />
        {selectedUser && (
            <AssignCompanyPopup 
                open={assignPopupOpen}
                onOpenChange={setAssignPopupOpen}
                userId={selectedUser.id}
                userEmail={selectedUser.email}
                onAssign={handleAssignSubmit}
                isAssigning={assigningUserId === selectedUser.id}
            />
        )}
    </div>;
}