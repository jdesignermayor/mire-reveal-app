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
    <div className="flex flex-col w-72 h-[calc(100vh)] border-r p-6 gap-56">
      <div className="flex flex-col gap-6">
        <div className="font-bold flex gap-2 h-10">
            <CompanyLogoPanel settings={settings} />
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/create-illustration" onClick={resetMenu}>
            <Button className="w-full cursor-pointer bg-[#A565FF] hover:bg-[#9B4DFF] text-white">
              <PaintbrushIcon />
              Revelar ecografía hiperrealista
            </Button>
          </Link>
        </div>
        <div>
          <ul className="flex flex-col pt-3 gap-1">
            {menuOptionsWithActiveState.map((option) => {
              return (
                <li key={option.label}>
                  <Link
                    href={option.link}
                    prefetch={false}
                    onClick={handleMenuOptionClick}
                    shallow={true}
                  >
                    <Button
                      variant={"ghost"}
                      size="lg"
                      aria-label="Submit"
                      className={
                        "w-full flex justify-start cursor-pointer gap-3" +
                        (option.isActive ? " bg-gray-100  text-[#A565FF] hover:text-[#A565FF]" : " text-gray-500 ")
                      }
                    >
                      <DynamicIcon name={option.icon} className={" size-5 "} />
                      <p className={option.isActive ? "text-[#A565FF]" : " text-black "}>{option.label}</p>
                    </Button>
                  </Link>
                </li>
              );
            })}
            {isAdmin && (
              <li>
                <Link
                  href="/dashboard/admin"
                  prefetch={false}
                  onClick={handleMenuOptionClick}
                  shallow={true}
                >
                  <Button
                    variant={"ghost"}
                    size="lg"
                    aria-label="Submit"
                    className={
                      "w-full flex justify-start cursor-pointer gap-3" +
                      (pathname === "/dashboard/admin" ? " bg-gray-100  text-[#A565FF] hover:text-[#A565FF]" : " text-gray-500 ")
                    }
                  >
                    <DynamicIcon name="settings" className={" size-5 "} />
                    <p className={pathname === "/dashboard/admin" ? "text-[#A565FF]" : " text-black "}>Admin</p>
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
