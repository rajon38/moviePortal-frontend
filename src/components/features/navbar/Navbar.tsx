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
        <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
            <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-xl font-bold tracking-tight text-primary">
                    CinePlex
                </Link>

                <div className="hidden items-center gap-5 md:flex">
                    {publicNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium text-slate-700 hover:text-primary",
                                    isActive && "text-primary underline underline-offset-8"
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
                                <Button size="sm" variant="outline">Register</Button>
                            </Link>
                            <Link href="/login">
                                <Button size="sm">Login</Button>
                            </Link>
                        </>
                    )}
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" aria-label="Open menu">
                                <Menu className="size-4" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-72">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>

                            <div className="space-y-2 px-4">
                                {publicNavItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                                    return (
                                        <SheetClose key={item.href} asChild>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary",
                                                    isActive && "bg-slate-100 text-primary"
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
                                                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary"
                                            >
                                                My Profile
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                href="/change-password"
                                                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary"
                                            >
                                                Change Password
                                            </Link>
                                        </SheetClose>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <SheetClose asChild>
                                            <Link href="/register">
                                                <Button variant="outline" className="w-full">Register</Button>
                                            </Link>
                                        </SheetClose>

                                        <SheetClose asChild>
                                            <Link href="/login">
                                                <Button className="w-full">Login</Button>
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
