import { Song } from "@/types";
import { Clock, Music } from "lucide-react";
import PlayButton from "@/pages/home/components/PlayButton";

type SongListProps = {
  songs: Song[];
  isLoading: boolean;
};

const SongList = ({ songs, isLoading }: SongListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-zinc-800/40 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-zinc-900/40 rounded-md overflow-hidden">
      <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800">
        <div className="w-4">#</div>
        <div>Title</div>
        <div>Album</div>
        <div className="flex justify-end">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Music className="h-12 w-12 text-zinc-500 mb-2" />
          <p className="text-zinc-500">No songs found</p>
        </div>
      ) : (
        songs.map((song, index) => (
          <div
            key={song._id}
            className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800/40 group"
          >
            <div className="flex items-center justify-center w-4">{index + 1}</div>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover rounded-sm" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <PlayButton song={song} />
                </div>
              </div>
              <div>
                <p className="font-medium text-white truncate">{song.title}</p>
                <p className="text-xs truncate">{song.artist}</p>
              </div>
            </div>
            <div className="flex items-center">{song.albumId || "Single"}</div>
            <div className="flex items-center justify-end">{formatDuration(song.duration)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default SongList;