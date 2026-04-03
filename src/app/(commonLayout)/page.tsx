import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMediaList } from "@/services/media.services";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Play, Plus } from "lucide-react";
import MediaCard from "@/components/features/media/MediaCard";

export default async function Home() {
  const movieResult = await getMediaList({ type: "MOVIE", limit: 8 });
  const seriesResult = await getMediaList({ type: "SERIES", limit: 8 });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        {/* Carousel Banner */}
        <div className="group relative mb-10 overflow-hidden rounded-2xl">
          <div className="relative h-96 w-full">
            <Image
              src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1200&h=500&fit=crop"
              alt="Featured"
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          </div>
          
          {/* Banner Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <Badge className="mb-4 w-fit bg-red-600 text-white hover:bg-red-700">Now Playing</Badge>
            <h1 className="max-w-2xl text-4xl font-bold md:text-5xl lg:text-6xl">The Dark Knight</h1>
            <p className="mt-2 text-sm text-gray-300 md:text-base">Action • 2h 32m</p>
            <div className="mt-6 flex gap-3">
              <Link href="/media">
                <Button className="gap-2 bg-red-600 hover:bg-red-700">
                  <Play className="h-4 w-4" />
                  Watch Now
                </Button>
              </Link>
              <Link href="/media">
                <Button variant="outline" className="gap-2 border-white text-white hover:bg-white/10">
                  <Plus className="h-4 w-4" />
                  Add to List
                </Button>
              </Link>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-8 flex gap-2 md:bottom-6">
            <div className="h-1 w-8 bg-red-600" />
            <div className="h-1 w-2 bg-white/30" />
            <div className="h-1 w-2 bg-white/30" />
          </div>
        </div>

        {/* Featured Movies Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Featured Movies</h2>
            <Link href="/media?type=MOVIE" className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-400">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {movieResult.data.map((media) => (
              <MediaCard key={media.id} media={media} />
            ))}
          </div>
        </section>

        {/* Top Series Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Top Series</h2>
            <Link href="/media?type=SERIES" className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-400">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {seriesResult.data.map((media) => (
              <MediaCard key={media.id} media={media} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-gray-400 md:flex-row">
          <p>© {new Date().getFullYear()} CinePlex. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/media" className="hover:text-red-500">Browse Media</Link>
            <Link href="/login" className="hover:text-red-500">Login</Link>
            <Link href="/register" className="hover:text-red-500">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
