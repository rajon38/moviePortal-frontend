"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IMedia } from "@/types/media.types";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

interface MediaCardProps {
    media: IMedia;
}

const MediaCard = ({ media }: MediaCardProps) => {
    return (
        <Link href={`/media/${media.id}`}>
            <Card className="h-full border-slate-800 bg-slate-900 overflow-hidden hover:border-red-500 transition-colors group cursor-pointer">
                {/* Image Container with Overlay */}
                <div className="relative h-48 bg-slate-800 overflow-hidden">
                    {media.imageUrl ? (
                        <Image
                            src={media.imageUrl}
                            alt={media.title}
                            width={400}
                            height={300}
                            unoptimized
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs text-gray-500">
                            No image available
                        </div>
                    )}

                    {/* Rating Badge */}
                    {media.avgRating && (
                        <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1">
                            <p className="text-xs font-semibold text-red-400">
                                ⭐ {media.avgRating}
                            </p>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <div className="rounded-full bg-red-600 hover:bg-red-700 text-white p-3 transition-colors">
                            <Play className="h-5 w-5 fill-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-2">
                    <div>
                        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                            {media.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {media.releaseYear} • {media.type}
                        </p>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2">
                        {media.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                        {media.genres.slice(0, 2).map((genre) => (
                            <Badge key={genre} className="bg-slate-800 text-gray-300 text-[10px]">{genre}</Badge>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="border-slate-700 text-gray-300 text-[10px]">{media.pricing}</Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default MediaCard;
