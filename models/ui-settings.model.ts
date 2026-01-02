import type { IconName } from "lucide-react/dynamic";

export type MenuOption = {
  isActive: boolean;
  label: string;
  icon: IconName;
  link: string;
};

export type Stepper = {
  currentStep: number;
  totalSteps: number;
};

export interface UISettings {
  menuOptions: MenuOption[];
  isCreationalModeEnabled: boolean;
  stepper: Stepper;
}
