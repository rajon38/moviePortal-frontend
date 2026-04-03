"use client";

import Image from "next/image";

export default function GlobalLoading() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">

      {/* 🎬 Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600"
          alt="background"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      </div>

      {/* 🔥 Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">

        {/* Logo / Brand */}
        <h1 className="text-4xl font-bold text-red-600 tracking-wide animate-pulse">
          🎬 CinePlex
        </h1>

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="text-gray-400 text-sm animate-pulse">
          Loading your experience...
        </p>
      </div>
    </div>
  );
}