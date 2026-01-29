import { getAuthUsers } from "@/actions/admin";
import { CompaniesTable } from "@/components/features/admin/CompaniesTable";
import { CreateCompanyPopup } from "@/components/features/admin/CreateCompanyPopup";
import { CreateUserPopup } from "@/components/features/admin/CreateUserPopup";
import { RegisteredUsersTable } from "@/components/features/admin/RegisteredUsersTable";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
    const { users, aud } = await getAuthUsers();
    console.log(users, aud);

    return <section className="p-6">
        <div className="grid gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Admin</h1>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">Companies</p>
                    <CreateCompanyPopup>
                        <Button>Create Company</Button>
                    </CreateCompanyPopup>
                </div>
                <CompaniesTable />
            </div>
             <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">Created users</p>
                    <CreateUserPopup>
                        <Button>Create User</Button>
                    </CreateUserPopup>
                </div>
                <RegisteredUsersTable />
            </div>
        </div>
    </section>;
}