import type { UISettings } from "@/models/ui-settings.model";
import { atom } from "jotai";

const initialValue: UISettings = {
  menuOptions: [
    {
      isActive: true,
      label: "Inicio",
      icon: "home",
      link: "/dashboard",
    },
    {
      isActive: false,
      label: "Perfiles",
      icon: "user-round",
      link: "/dashboard/profiles",
    },
    {
      isActive: false,
      label: "Configuración",
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
