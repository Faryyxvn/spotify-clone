import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { useSearchStore } from "@/stores/useSearchStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SongList from "@/pages/search/components/SongList";

const SearchPage = () => {
  const { query, setQuery, searchSongs, results, isSearching } = useSearchStore();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Update debounced query after 500ms of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      searchSongs(debouncedQuery);
    }
  }, [debouncedQuery, searchSongs]);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Search</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you want to listen to?"
                className="pl-10 bg-zinc-800 border-zinc-700 focus-visible:ring-green-500 h-12"
              />
            </div>
          </div>

          {query.trim() !== "" && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Songs</h2>
              <SongList songs={results} isLoading={isSearching} />
            </div>
          )}

          {query.trim() !== "" && results.length === 0 && !isSearching && (
            <div className="text-center py-10">
              <p className="text-zinc-400 text-lg">No results found for "{query}"</p>
              <p className="text-zinc-500">Try a different search term</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
};

export default SearchPage;