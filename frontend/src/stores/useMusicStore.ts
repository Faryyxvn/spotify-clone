import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";
import axios from "axios";

interface SongStats {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  totalPlays?: number;
  weeklyPlays?: number;
  monthlyPlays?: number;
  yearlyPlays?: number;
}

interface RecentlyPlayedSong {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  lastPlayed: string;
}

interface PlayStats {
  topSongs: SongStats[];
  weeklyTopSongs: SongStats[];
  monthlyTopSongs: SongStats[];
  yearlyTopSongs: SongStats[];
  totalPlaysStats: {
    totalPlays: number;
    weeklyPlays: number;
    monthlyPlays: number;
    yearlyPlays: number;
  };
  recentlyPlayed: RecentlyPlayedSong[];
}

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;
  playStats: PlayStats;
  playCounts: Record<string, number>;
  isLoadingPlayStats: boolean;
  playStatsError: string | null;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  fetchPlayStats: () => Promise<void>;
  resetPeriodicStats: (period: string) => Promise<boolean>;
  incrementPlayCount: (songId: string) => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },
  playStats: {
    topSongs: [],
    weeklyTopSongs: [],
    monthlyTopSongs: [],
    yearlyTopSongs: [],
    totalPlaysStats: {
      totalPlays: 0,
      weeklyPlays: 0,
      monthlyPlays: 0,
      yearlyPlays: 0,
    },
    recentlyPlayed: [],
  },
  playCounts: {}, // Store play counts by song ID
  isLoadingPlayStats: false,
  playStatsError: null,

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);

      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      console.log("Error in deleteSong", error);
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete album: " + error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlayStats: async () => {
    try {
      set({ isLoadingPlayStats: true, playStatsError: null });
      const { data } = await axiosInstance.get('/stats/plays');
      set({ playStats: data, isLoadingPlayStats: false });
    } catch (error: any) {
      set({ 
        isLoadingPlayStats: false, 
        playStatsError: error.response?.data?.message || 'Failed to fetch play stats' 
      });
    }
  },
  
  resetPeriodicStats: async (period) => {
    try {
      const { data } = await axios.post('/api/admin/reset-stats', { period });
      if (data.success) {
        await get().fetchPlayStats();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Failed to reset stats:', error);
      return false;
    }
  },
  
  incrementPlayCount: (songId) => {
    set((state) => ({
      playCounts: {
        ...state.playCounts,
        [songId]: (state.playCounts[songId] || 0) + 1,
      },
    }));
  },
}));