"use client";

import { logoutAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import { getAllWatchlistItems } from "@/services/watchlist.services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, List, User, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

const UserDashboardPage = () => {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    // Fetch watchlist items count
    const { data: watchlistData } = useQuery({
        queryKey: ["watchlist"],
        queryFn: () =>
            getAllWatchlistItems({
                page: 1,
                limit: 1,
            }),
    });

    const { mutateAsync: logoutMutate, isPending: isLogoutPending } = useMutation({
        mutationFn: () => logoutAction(),
    });

    const menuItems = [
        { label: "Dashboard", href: "/dashboard", icon: Home },
        { label: "My Profile", href: "/my-profile", icon: User },
        { label: "My List", href: "/myList", icon: List },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}>
                <div className="p-6 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black text-sm">
                            C
                        </div>
                        {sidebarOpen && <span className="font-bold text-red-500">CinePlex</span>}
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    active
                                        ? "bg-red-600 text-white"
                                        : "text-gray-300 hover:bg-slate-800 hover:text-red-400"
                                }`}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-800">
                    <Button
                        onClick={async () => {
                            await logoutMutate();
                        }}
                        disabled={isLogoutPending}
                        className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        {sidebarOpen && (isLogoutPending ? "Logging out..." : "Logout")}
                    </Button>
                </div>

                {/* Toggle Sidebar */}
                <div className="p-4 border-t border-slate-800">
                    <Button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        variant="outline"
                        className="w-full border-slate-700 text-red-500 hover:bg-slate-800"
                        size="sm"
                    >
                        {sidebarOpen ? "←" : "→"}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="mx-auto w-full max-w-6xl p-6 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-bold text-white">Welcome back! 🎬</h1>
                        <p className="mt-2 text-gray-400">Manage your profile and continue watching your favorite movies.</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white text-sm">My List Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-500">{watchlistData?.meta?.total || 0}</p>
                                <p className="text-xs text-gray-400 mt-1">Movies and series saved</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white text-sm">Continue Watching</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-500">0</p>
                                <p className="text-xs text-gray-400 mt-1">Items in progress</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white text-sm">Recently Added</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-500">0</p>
                                <p className="text-xs text-gray-400 mt-1">New content this week</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-800 hover:border-red-500 transition-colors cursor-pointer">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <User className="h-5 w-5 text-red-500" />
                                    My Profile
                                </CardTitle>
                                <CardDescription className="text-gray-400">Update your profile information and profile picture</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/my-profile">
                                    <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
                                        View Profile
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-800 hover:border-red-500 transition-colors cursor-pointer">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <List className="h-5 w-5 text-red-500" />
                                    My List
                                </CardTitle>
                                <CardDescription className="text-gray-400">View all your saved movies and series</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/myList">
                                    <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
                                        Go to My List
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Featured Section */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-xl">Quick Links</CardTitle>
                            <CardDescription className="text-gray-400">Browse content</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/media?type=MOVIE">
                                <Button variant="outline" className="w-full border-slate-700 text-red-500 hover:bg-slate-800 hover:text-red-400">
                                    Browse Movies
                                </Button>
                            </Link>
                            <Link href="/media?type=SERIES">
                                <Button variant="outline" className="w-full border-slate-700 text-red-500 hover:bg-slate-800 hover:text-red-400">
                                    Browse Series
                                </Button>
                            </Link>
                            <Link href="/media">
                                <Button variant="outline" className="w-full border-slate-700 text-red-500 hover:bg-slate-800 hover:text-red-400">
                                    All Content
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="w-full border-slate-700 text-red-500 hover:bg-slate-800 hover:text-red-400">
                                    Home
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default UserDashboardPage;
