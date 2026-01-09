import GeneralMenu from "@/components/shared/GeneralMenu";
import QueryProvider from "@/components/shared/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { getSettings } from "@/actions/settings";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  
  if(!settings){
      return;
  }
  
  return (
      <div className="relative h-[calc(95vh)]">
        <div className="flex ">
          <div>
            <GeneralMenu settings={settings} />
          </div>
          <div className="flex justify-center w-full ">
            <div className="flex w-full h-full">
              <div className="w-full"><QueryProvider>{children}</QueryProvider></div>
            </div>
          </div>
        </div>
        <Toaster position="top-center" />
      </div>
  );
}
