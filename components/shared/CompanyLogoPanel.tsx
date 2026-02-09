"use client";

import { GetSettingsType } from "@/actions/settings";
import Image from "next/image";

export default function CompanyLogoPanel({ settings }: { settings: GetSettingsType }) {

    const hasLogo = !!settings.logo_public_url;

    return <div className="flex gap-3 items-center">
        <div>
            <Image src="/logo.svg" alt="Logo" width={100} height={25} priority={true} className={" invert brightness-0 "+(hasLogo ? "w-15 h-15" : "w-20 h-40")} />
        </div>
        {hasLogo && (
            <div>
                <Image src={settings.logo_public_url} alt="Logo" width={100} height={100} priority={true} className=" w-11 h-11 rounded-full object-cover" />
            </div>
        )}
    </div>
}