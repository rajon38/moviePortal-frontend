"use client";

import { logoutAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import { getAllWatchlistItems } from "@/services/watchlist.services";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userNavItems } from "@/lib/navitems";
import { User, List } from "lucide-react";

const UserDashboardPage = () => {
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

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <DashboardSidebar 
                navSections={userNavItems} 
                onLogout={logoutMutate}
                isLogoutPending={isLogoutPending}
            />

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
