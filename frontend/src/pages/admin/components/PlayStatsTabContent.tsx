import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMusicStore } from "@/stores/useMusicStore";
import { BarChart3, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PlayStatsTabContent = () => {
  const { playStats, isLoadingPlayStats, playStatsError, fetchPlayStats, resetPeriodicStats } = useMusicStore();

  useEffect(() => {
    fetchPlayStats();
  }, [fetchPlayStats]);

  if (isLoadingPlayStats) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading play statistics...</div>
      </div>
    );
  }

  if (playStatsError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400">{playStatsError}</div>
      </div>
    );
  }

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Total Plays Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="size-5 text-sky-500" />
            Total Play Statistics
          </CardTitle>
          <CardDescription>Overview of music plays across different timeframes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="All Time"
              value={formatNumber(playStats.totalPlaysStats.totalPlays)}
              resetButton={false}
            />
            <StatCard
              title="This Week"
              value={formatNumber(playStats.totalPlaysStats.weeklyPlays)}
              resetButton={true}
              onReset={() => resetPeriodicStats('weekly')}
              period="weekly"
            />
            <StatCard
              title="This Month"
              value={formatNumber(playStats.totalPlaysStats.monthlyPlays)}
              resetButton={true}
              onReset={() => resetPeriodicStats('monthly')}
              period="monthly"
            />
            <StatCard
              title="This Year"
              value={formatNumber(playStats.totalPlaysStats.yearlyPlays)}
              resetButton={true}
              onReset={() => resetPeriodicStats('yearly')}
              period="yearly"
            />
          </div>
        </CardContent>
      </Card>

      {/* Top Songs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopSongsCard title="Top Played Songs (All Time)" songs={playStats.topSongs} playType="totalPlays" />
        <TopSongsCard title="Top Played Songs (This Week)" songs={playStats.weeklyTopSongs} playType="weeklyPlays" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopSongsCard title="Top Played Songs (This Month)" songs={playStats.monthlyTopSongs} playType="monthlyPlays" />
        <TopSongsCard title="Top Played Songs (This Year)" songs={playStats.yearlyTopSongs} playType="yearlyPlays" />
      </div>

      {/* Recently Played */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5 text-orange-500" />
            Recently Played Songs
          </CardTitle>
          <CardDescription>Last played songs across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-zinc-800/50">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Last Played</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playStats.recentlyPlayed.map((song) => (
                <TableRow key={song._id} className="hover:bg-zinc-800/50">
                  <TableCell>
                    <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{song.title}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>
                    {new Date(song.lastPlayed).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, resetButton, onReset, period }) => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/80 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-zinc-200">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-zinc-400">plays</p>
          {resetButton && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={onReset}
            >
              Reset {period} plays
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TopSongsCard = ({ title, songs, playType }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="size-5 text-emerald-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-zinc-800/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead className="text-right">Plays</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-zinc-400">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              songs.map((song) => (
                <TableRow key={song._id} className="hover:bg-zinc-800/50">
                  <TableCell>
                    <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{song.title}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell className="text-right font-semibold">{song[playType]?.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlayStatsTabContent;