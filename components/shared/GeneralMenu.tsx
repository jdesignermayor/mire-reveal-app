"use client";

import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { PaintbrushIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { resetMenuOptions, UISettingsAtom } from "@/store/ui-settings-store";
import SignOutButton from "./SignOutButton";
import { useEffect } from "react";
import CompanyLogoPanel from "./CompanyLogoPanel";
import { GetSettingsType } from "@/actions/settings";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/animate-ui/components/radix/sidebar";

export default function GeneralMenu({ settings, isAdmin }: { settings: GetSettingsType, isAdmin: boolean }) {
  const [uiSettings, setUiSettings] = useAtom(UISettingsAtom);
  const { menuOptions } = uiSettings;
  const pathname = usePathname();
  const [, resetMenu] = useAtom(resetMenuOptions);

  // Compute active state directly from pathname instead of storing in state
  const menuOptionsWithActiveState = menuOptions.map((option) => {
    // Special handling for dashboard root - only exact matches
    if (option.link === "/dashboard") {
      return {
        ...option,
        isActive: pathname === "/dashboard" || pathname === "/dashboard/",
      };
    }

    return {
      ...option,
      isActive: pathname === option.link || pathname.startsWith(option.link + "/"),
    };
  });

  const handleMenuOptionClick = () => {
    resetMenu();
  };

  useEffect(() => {
    setUiSettings({
      ...uiSettings,
      settings,
    });
  }, [settings]);

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="dark">
        <SidebarHeader className="">
          <div className="flex flex-col gap-6">
            <div className="font-bold flex gap-2 h-10">
              <CompanyLogoPanel settings={settings} />
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard/create-illustration" onClick={resetMenu}>
                <Button className="w-full cursor-pointer bg-primary ">
                  <PaintbrushIcon />
                  Reveal ultrasound
                </Button>
              </Link>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="">
          <SidebarGroup className="">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuOptionsWithActiveState.map((option) => (
                  <SidebarMenuItem key={option.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={option.isActive}
                      tooltip={option.label}
                      className="text-slate-300 hover:text-white  data-[active=true]:text-white"
                    >
                      <Link
                        href={option.link}
                        prefetch={false}
                        onClick={handleMenuOptionClick}
                        shallow={true}
                      >
                        <DynamicIcon name={option.icon} className="size-5 text-slate-400" />
                        <span>{option.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/admin"}
                      tooltip="Admin"
                      className="text-slate-300 hover:text-white  data-[active=true]:text-white"
                    >
                      <Link
                        href="/dashboard/admin"
                        prefetch={false}
                        onClick={handleMenuOptionClick}
                        shallow={true}
                      >
                        <DynamicIcon name="settings" className="size-5 text-slate-400" />
                        <span>Admin</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter >
          <SignOutButton />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
