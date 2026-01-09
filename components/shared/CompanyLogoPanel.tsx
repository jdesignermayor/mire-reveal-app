"use client";

import { GetSettingsType } from "@/actions/settings";
import Image from "next/image";

export default function CompanyLogoPanel({ settings }: { settings: GetSettingsType }) {
    return <div className="flex gap-3 items-center">
        <div>
            <Image src="/logo.svg" alt="Logo" width={100} height={25} priority={true} className=" w-15 h-40" />
        </div>
        <div>
            <Image src={settings.logo_public_url} alt="Logo" width={100} height={100} priority={true} className="w-15 h-auto rounded-full" />
        </div>
    </div>
}