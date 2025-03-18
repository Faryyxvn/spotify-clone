import { SignedOut, UserButton, useAuth } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = location.pathname === "/search";
  const { isAdmin } = useAuthStore();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoForward = () => {
    navigate(1);
  };

  return (
    <div className="bg-zinc-900/90 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between p-4">
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <img src="/spotify.png" className="size-8" alt="Spotify logo" />
          <span className="font-medium">Spotify</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
            onClick={handleGoBack}
          >
            <span className="sr-only">Go back</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
            onClick={handleGoForward}
          >
            <span className="sr-only">Go forward</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
        </div>
        
        {!isSearchPage && (
          <Link to="/search" className="flex-1 max-w-md">
            <Button
              variant="outline"
              className="bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white flex items-center gap-2 w-full justify-start px-4"
            >
              <Search className="h-4 w-4 min-w-4" />
              <span className="truncate">Search songs, artists, albums...</span>
            </Button>
          </Link>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link to="/admin" className={cn(buttonVariants({ variant: "outline" }))}>
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;