import Image from "next/image";
import { Suspense } from "react";
import { Button } from "../ui/button";
import SignInButton from "./SignInButton";



export default async function MainNabvar() {
    return <nav className="flex w-full items-center justify-center max-w-7xl mx-auto px-4 py-4 fixed top-0 left-0 right-0 z-50 ">
        <ul className="flex justify-between items-center w-full">
            <li><Image src="/logo.svg" alt="Logo" width={100} height={90} priority={true} className="brightness-0" /></li>
            {/* <li className="flex gap-6 items-center">
                <Link href="#benefits" className="text-sm font-medium hover:text-[#3e62ff] transition-colors">Benefits</Link>
                <Link href="#how-it-works" className="text-sm font-medium hover:text-[#3e62ff] transition-colors">How it works</Link>
                <Link href="#pricing" className="text-sm font-medium hover:text-[#3e62ff] transition-colors">Pricing</Link>
                <Link href="#faqs" className="text-sm font-medium hover:text-[#3e62ff] transition-colors">FAQs</Link>
            </li> */}
            <li className="flex gap-3">
                <Suspense fallback={<div>Loading...</div>}>
                    <SignInButton />
                </Suspense>
                <Button className="relative group bg-gradient-to-r from-[#3e62ff] to-[#6b8cff] text-white px-6 py-3  text-lg font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#3e62ff]/25 hover:scale-105 active:scale-95">Book a demo</Button>
            </li>
        </ul>
    </nav>
}