"use client";

import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { PaintbrushIcon } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import Link from "next/link";

import type { MenuOption } from "@/models/ui-settings.model";
import { resetMenuOptions, UISettingsAtom } from "@/store/ui-settings-store";
import Image from "next/image";
import SignOutButton from "./SignOutButton";


export default function GeneralMenu() {
  const [uiSettings, setUISettings] = useAtom(UISettingsAtom);
  const { menuOptions } = uiSettings;
  const [, resetMenu] = useAtom(resetMenuOptions);

  const handleMenuOptionClick = (option: MenuOption) => {
    const computedOptions = menuOptions.map((currentOption) => {
      let isActivated = false;

      if (currentOption.label === option.label) {
        isActivated = true;
      }
      return {
        ...currentOption,
        isActive: isActivated,
      };
    });

    setUISettings({ ...uiSettings, menuOptions: computedOptions });
  };

  return (
    <div className="flex flex-col w-72 h-[calc(100vh)] border-r p-3 gap-56">
      <div className="flex flex-col gap-6">
        <div className="font-bold flex gap-2  text-xl">
          <Image src="/logo.svg" alt="Logo" width={100} height={25} priority={true} />
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/create-illustration" onClick={resetMenu}>
            <Button className="w-full cursor-pointer bg-[#A565FF] hover:bg-[#9B4DFF] text-white">
              <PaintbrushIcon />
              Crear ecografía hiperrealista
            </Button>
          </Link>
        </div>
        <div>
          <ul className="flex flex-col pt-3 gap-1">
            {menuOptions.map((option) => {
              return (
                <li key={option.label}>
                  <Link
                    href={option.link}
                    onClick={() => handleMenuOptionClick(option)}
                  >
                    <Button
                      variant={"ghost"}
                      size="lg"
                      aria-label="Submit"
                      className={
                        "w-full flex justify-start cursor-pointer" +
                        (option.isActive ? " bg-gray-100 font-bold" : "")
                      }
                    >
                      <DynamicIcon name={option.icon} />
                      {option.label}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
         <SignOutButton />
        </div>
      </div>
    </div>
  );
}
