"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { authRoutes } from "@/lib/authUtils";
import { publicNavItems } from "@/lib/navitems";
import { cn } from "@/lib/utils";
import { IUserProfile } from "@/types/auth.types";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";

interface NavbarProps {
    user: IUserProfile | null;
}

const Navbar = ({ user }: NavbarProps) => {
    const pathname = usePathname();

    // Hide navbar on auth pages
    if (authRoutes.includes(pathname)) {
        return null;
    }

    return (
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950 shadow-lg">
            <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-red-500 hover:text-red-400 transition-colors">
                    <span className="h-8 w-8 rounded bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black">C</span>
                    CinePlex
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {publicNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium text-gray-300 hover:text-red-400 transition-colors",
                                    isActive && "text-red-500 border-b-2 border-red-500 pb-1"
                                )}
                            >
                                {item.title}
                            </Link>
                        );
                    })}

                    {user ? (
                        <UserDropdown user={user} />
                    ) : (
                        <>
                            <Link href="/register">
                                <Button size="sm" variant="outline" className="border-gray-600 text-red-500 hover:bg-slate-800 hover:text-red-400">
                                    Sign Up
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                    Sign In
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-gray-300 hover:text-red-400" aria-label="Open menu">
                                <Menu className="size-4" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-72 bg-slate-900 border-l border-slate-800">
                            <SheetHeader>
                                <SheetTitle className="text-white">Menu</SheetTitle>
                            </SheetHeader>

                            <div className="space-y-2 px-4">
                                {publicNavItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                                    return (
                                        <SheetClose key={item.href} asChild>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-red-400 transition-colors",
                                                    isActive && "bg-slate-800 text-red-500"
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        </SheetClose>
                                    );
                                })}

                                {user ? (
                                    <>
                                        <SheetClose asChild>
                                            <Link
                                                href="/my-profile"
                                                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-red-400 transition-colors"
                                            >
                                                My Profile
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                href="/change-password"
                                                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-red-400 transition-colors"
                                            >
                                                Change Password
                                            </Link>
                                        </SheetClose>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <SheetClose asChild>
                                            <Link href="/register">
                                                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-slate-800 hover:text-red-400">
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </SheetClose>

                                        <SheetClose asChild>
                                            <Link href="/login">
                                                <Button className="w-full bg-red-600 hover:bg-red-700">
                                                    Sign In
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
