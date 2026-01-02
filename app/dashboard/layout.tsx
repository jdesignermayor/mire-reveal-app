import GeneralMenu from "@/components/shared/GeneralMenu";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative h-[calc(95vh)]">
      <div className="flex ">
        <div>
          <GeneralMenu />
        </div>
        <div className="flex justify-center w-full ">
          <div className="flex w-full h-full">
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
