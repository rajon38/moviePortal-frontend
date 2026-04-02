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
                <Button variant="ghost" className="h-auto rounded-full p-0">
                    <Avatar>
                        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                        <AvatarFallback>{getInitials(user.name, user.email)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 min-w-56">
                <DropdownMenuLabel>
                    <p className="text-sm font-medium text-foreground">{user.name || "User"}</p>
                    <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href={getDashboardPathByRole(user.role)}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/my-profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/change-password">Change Password</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
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
