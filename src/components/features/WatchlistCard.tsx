import { IMedia } from "@/types/media.types";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface WatchlistCardProps {
  media: IMedia;
  onRemove: () => void;
  isRemoving: boolean;
}

export const WatchlistCard = ({ media, onRemove, isRemoving }: WatchlistCardProps) => {
  return (
    <Link href={`/media/${media.id}`}>
      <Card className="h-full border-slate-800 bg-slate-900 overflow-hidden hover:border-red-500 transition-colors group cursor-pointer">
        {/* Image Container */}
        <div className="relative h-48 bg-slate-800 overflow-hidden">
          {media.imageUrl ? (
            <Image
              src={media.imageUrl}
              alt={media.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-slate-800 text-xs text-gray-500">
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

          {/* Remove Button on Hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            disabled={isRemoving}
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-2 rounded-full"
            title="Remove from watchlist"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
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

          <div className="flex flex-wrap gap-1">
            <Badge className={`text-[10px] ${
              media.pricing === "FREE"
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}>
              {media.pricing}
            </Badge>
            {media.price && (
              <Badge variant="outline" className="border-slate-700 text-gray-300 text-[10px]">
                ${media.price}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
