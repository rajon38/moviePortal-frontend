"use client";

import Image from "next/image";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black">
            {/* Background Image */}
            <Image
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80"
                alt="bg"
                className="absolute inset-0 w-full h-full object-cover brightness-50"
                fill
                unoptimized
                priority
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black" />

            {/* Content */}
            <div className="relative z-10 w-full px-4">
                {children}
            </div>
        </div>
    );
};

export default AuthWrapper;