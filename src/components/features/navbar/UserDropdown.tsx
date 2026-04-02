"use client";

import { logoutAction } from "@/actions/auth.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IUserProfile } from "@/types/auth.types";
import { useTransition } from "react";
import Link from "next/link";

interface UserDropdownProps {
    user: IUserProfile;
}

const getDashboardPathByRole = (role?: string) => {
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
        return "/admin/dashboard";
    }

    return "/dashboard";
};

const getInitials = (name?: string, email?: string) => {
    if (name && name.trim().length > 0) {
        return name
            .trim()
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    return email?.slice(0, 2).toUpperCase() || "U";
};

const UserDropdown = ({ user }: UserDropdownProps) => {
    const [isPending, startTransition] = useTransition();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto rounded-full p-0 hover:bg-slate-800">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                        <AvatarFallback className="bg-red-600 text-white font-bold">{getInitials(user.name, user.email)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 min-w-56 bg-slate-900 border-slate-800 text-white">
                <DropdownMenuLabel>
                    <p className="text-sm font-medium text-white">{user.name || "User"}</p>
                    <p className="text-xs font-normal text-gray-400">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />

                <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-800 hover:text-red-400">
                    <Link href={getDashboardPathByRole(user.role)}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-800 hover:text-red-400">
                    <Link href="/my-profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-800 hover:text-red-400">
                    <Link href="/change-password">Change Password</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-800" />

                <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer text-red-400 hover:bg-red-950 hover:text-red-500 focus:bg-red-950 focus:text-red-500"
                    onSelect={(event) => {
                        event.preventDefault();
                        startTransition(async () => {
                            await logoutAction();
                        });
                    }}
                    disabled={isPending}
                >
                    {isPending ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
