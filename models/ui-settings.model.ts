import type { IconName } from "lucide-react/dynamic";

export type MenuOption = {
  isActive: boolean;
  label: string;
  icon: IconName;
  link: string;
};

export interface UISettings {
  menuOptions: MenuOption[];
}
