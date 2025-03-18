import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { Song } from "../types";

interface SearchState {
	query: string;
	results: Song[];
	isSearching: boolean;
	error: string | null;
	setQuery: (query: string) => void;
	searchSongs: (query: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
	query: "",
	results: [],
	isSearching: false,
	error: null,
	setQuery: (query) => set({ query }),
	searchSongs: async (query) => {
		try {
			set({ isSearching: true, error: null });
			
			const response = await axiosInstance.get(`/songs/search?query=${encodeURIComponent(query)}`);
			
			set({ 
				results: response.data,
				isSearching: false 
			});
		} catch (error) {
			set({
				error: error.response?.data?.message || "Failed to search songs",
				isSearching: false
			});
		}
	}
}));