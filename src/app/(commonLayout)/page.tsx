import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getMediaList } from "@/services/media.services";
import Link from "next/link";

export default async function Home() {
  const movieResult = await getMediaList({ type: "MOVIE", limit: 4 });
  const seriesResult = await getMediaList({ type: "SERIES", limit: 4 });

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <section className="rounded-2xl bg-gradient-to-r from-primary to-indigo-600 p-8 text-white md:p-12">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">Trending Now</Badge>
          <h1 className="max-w-2xl text-3xl font-bold md:text-5xl">Discover Movies and Series You’ll Love</h1>
          <p className="mt-4 max-w-2xl text-sm text-white/90 md:text-base">
            Browse fresh releases, timeless classics, and premium series in one place.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/media"><Button variant="secondary">Explore Media</Button></Link>
            <Link href="/register"><Button variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-primary">Get Started</Button></Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured Movies</h2>
            <Link href="/media?type=MOVIE" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {movieResult.data.map((media) => (
              <Card key={media.id} className="h-full">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{media.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-xs text-muted-foreground">{media.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{media.releaseYear} • {media.director}</p>
                </CardContent>
                <CardFooter className="justify-between">
                  <Badge variant="secondary">{media.pricing}</Badge>
                  <Link href={`/media/${media.id}`} className="text-xs font-medium text-primary hover:underline">Details</Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Top Series</h2>
            <Link href="/media?type=SERIES" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {seriesResult.data.map((media) => (
              <Card key={media.id} className="h-full">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{media.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-xs text-muted-foreground">{media.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{media.releaseYear} • {media.director}</p>
                </CardContent>
                <CardFooter className="justify-between">
                  <Badge variant="secondary">{media.pricing}</Badge>
                  <Link href={`/media/${media.id}`} className="text-xs font-medium text-primary hover:underline">Details</Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} CinePlex. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/media" className="hover:text-primary">Media</Link>
            <Link href="/login" className="hover:text-primary">Login</Link>
            <Link href="/register" className="hover:text-primary">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
