import type { UISettings } from "@/models/ui-settings.model";
import { atom } from "jotai";

const initialValue: UISettings = {
  menuOptions: [
    {
      isActive: true,
      label: "Home",
      icon: "home",
      link: "/dashboard",
    },
    {
      isActive: false,
      label: "Profiles",
      icon: "user-round",
      link: "/dashboard/profiles",
    },
    {
      isActive: false,
      label: "Settings",
      icon: "settings",
      link: "/dashboard/settings",
    },
  ],
  settings: null,
};

export const resetMenuOptions = atom(
  null,
  (get, set) => {
    const current = get(UISettingsAtom);

    const newOptions = current.menuOptions.map((opt) => ({
      ...opt,
      isActive: false,
    }));

    set(UISettingsAtom, {
      ...current,
      menuOptions: newOptions,
    });
  },
);

export const UISettingsAtom = atom(initialValue);
