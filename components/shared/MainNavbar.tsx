import Image from "next/image";
import { Suspense } from "react";
import { Button } from "../ui/button";
import SignInButton from "./SignInButton";



export default async function MainNabvar(){
    return <nav className="flex w-full items-center justify-center p-5 border-b border-black">
        <ul className="flex justify-between items-center w-full">
            <li><Image src="/logo.svg" alt="Logo" width={100} height={90} priority={true} /></li>
            <li className="flex gap-3">
                <Suspense fallback={<div>Loading...</div>}>
                    <SignInButton />
                </Suspense>
                <Button className="bg-[#A565FF] cursor-pointer">Soy un centro medico</Button>
            </li>
        </ul>
    </nav>
}