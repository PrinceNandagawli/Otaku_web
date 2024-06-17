import Link from "next/link";
import Image from "next/image";
import {
  SearchIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import { useState, useEffect } from "react";

const genres = [
  "Action",
  "Adventure",
  "Avant Garde",
  "Boys Love",
  "Comedy",
  "Demons",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Girls Love",
  "Gourmet",
  "Harem",
  "Horror",
  "Isekai",
  "Iyashikei",
  "Josei",
  "Kids",
  "Magic",
  "Mahou Shoujo",
  "Martial Arts",
  "Mecha",
  "Military",
  "Music",
  "Mystery",
  "Parody",
  "Psychological",
  "Reverse Harem",
  "Romance",
  "School",
  "Sci-Fi",
  "Seinen",
  "Shoujo",
  "Shounen",
  "Slice of Life",
  "Space",
  "Sports",
  "Super Power",
  "Supernatural",
  "Suspense",
  "Thriller",
  "Vampire",
];

const types = ["Movies", "TV Shows", "OVA", "ONA", "Specials"];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [isTypesOpen, setIsTypesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [desktopSearchResults, setDesktopSearchResults] = useState([]);
  const [mobileSearchResults, setMobileSearchResults] = useState([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle("overflow-hidden", !isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const fetchSearchResults = async () => {
        try {
          const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              query: `
                query ($search: String) {
                  Page(perPage: 5) {
                    media(search: $search, type: ANIME) {
                      id
                      title {
                        romaji
                      }
                    }
                  }
                }
              `,
              variables: { search: searchQuery },
            }),
          });

          const { data } = await response.json();
          if (windowWidth < 768) {
            setMobileSearchResults(data?.Page?.media || []);
          } else {
            setDesktopSearchResults(data?.Page?.media || []);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      fetchSearchResults();
    } else {
      setDesktopSearchResults([]);
      setMobileSearchResults([]);
    }
  }, [searchQuery, windowWidth]);

  return (
    <div>
      <nav className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu */}
            <div className="flex items-center md:hidden w-full justify-between">
              <button
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center mx-auto">
                <Link href="/">
                  <Image
                    src="/logo1.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                  />
                </Link>
                <span className="text-white text-xs font-bold ml-2">
                  OtakuWeb
                </span>
              </div>
              <div className="flex items-center">
                <UserIcon className="text-gray-300 hover:text-white h-6 w-6 mr-1" />
                <Link href="/login">
                  <div className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
                    Sign In
                  </div>
                </Link>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center">
              <div className="flex-shrink-0 mr-2">
                <Link href="/">
                  <Image
                    src="/logo1.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                  />
                </Link>
              </div>
              <div className="mr-6">
                <span className="text-white  px-3 py-2 rounded-md text-lg font-bold">
                  OtakuWeb
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 md:flex-none relative">
              <input
                type="text"
                placeholder="Search Anime here.... "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full px-3 py-1 bg-gray-700 text-white placeholder-gray-400 focus:outline-none w-full md:w-96 lg:w-96 sm:w-32"
              />
              <button className="ml-2 bg-gray-700 text-white px-4 py-1 rounded-full hover:bg-cyan-500">
                <SearchIcon className="h-5 w-5" />
              </button>
              {/* Search Results */}
              {searchQuery.length > 0 &&
                desktopSearchResults.length > 0 &&
                windowWidth >= 768 && (
                  <div className="absolute mt-72 bg-black text-white z-20 w-full max-w-md rounded-lg shadow-lg overflow-hidden">
                    {desktopSearchResults.map((anime) => (
                      <Link
                        key={anime.id}
                        href={`/animeplayer?animeId=${anime.id}`}
                      >
                        <span
                          className="block px-4 py-2 hover:bg-gray-800"
                          onClick={() => {
                            setSearchQuery(""); // Clear the search query
                            setDesktopSearchResults([]); // Clear the search results
                          }}
                        >
                          {anime.title.romaji}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
            </div>

            {/* Other Menu Items */}
            <div className="hidden md:flex items-baseline space-x-5 ml-auto">
              <Link href="/">
                <span className="text-white hover:text-cyan-500 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </span>
              </Link>
              <Link href="/animesongs">
                <span className="text-white hover:text-cyan-500 px-3 py-2 rounded-md text-sm font-medium">
                  Anime Songs
                </span>
              </Link>
              <Link href="/trending">
                <span className="text-white hover:text-cyan-500 px-3 py-2 rounded-md text-sm font-medium">
                  Trending
                </span>
              </Link>
              <div className="relative">
                <span
                  className="text-white hover:text-cyan-500 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                  onMouseOver={() => setIsGenresOpen(true)}
                  onMouseOut={() => setIsGenresOpen(false)}
                >
                  Genres
                </span>
                {isGenresOpen && (
                  <div
                    className="z-20 w-max absolute bg-slate-800 text-white mt-2 p-4 rounded shadow-lg grid grid-cols-3 gap-4"
                    onMouseOver={() => setIsGenresOpen(true)}
                    onMouseOut={() => setIsGenresOpen(false)}
                  >
                    {genres.map((genre, index) => (
                      <Link
                        key={index}
                        href={`/genre/${genre
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                      >
                        <span className="hover:bg-red-600 px-2 py-1 rounded cursor-pointer">
                          {genre}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <span
                  className="text-white hover:text-cyan-500 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                  onMouseOver={() => setIsTypesOpen(true)}
                  onMouseOut={() => setIsTypesOpen(false)}
                >
                  Type
                </span>
                {isTypesOpen && (
                  <div
                    className="z-20 w-max absolute bg-slate-800 text-white mt-2 p-4 rounded shadow-lg grid grid-cols-1 gap-2"
                    onMouseOver={() => setIsTypesOpen(true)}
                    onMouseOut={() => setIsTypesOpen(false)}
                  >
                    {types.map((type, index) => (
                      <Link
                        key={index}
                        href={`/type/${type.toLowerCase().replace(/ /g, "-")}`}
                      >
                        <span className="hover:bg-red-600 px-2 py-1 rounded cursor-pointer">
                          {type}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
             
            </div>

            {/* Sign In */}
            <div className="hidden md:flex items-center ml-auto">
              <UserIcon className="text-gray-300 hover:text-white h-6 w-6 mr-1" />
              <Link href="/login">
                <div className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
                  Sign In
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 p-4 w-full">
            <div className="space-y-4">
              <Link href="/">
                <span className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </span>
              </Link>
              <Link href="/animeplayer">
                <span className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Anime Songs
                </span>
              </Link>
              <Link href="/trending">
                <span className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Trending
                </span>
              </Link>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span
                    className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                    onClick={() => setIsGenresOpen(!isGenresOpen)}
                  >
                    Genres
                  </span>
                  <PlusIcon
                    className={`h-5 w-5 text-white cursor-pointer transform transition-transform duration-200 ${
                      isGenresOpen ? "rotate-45" : "rotate-0"
                    }`}
                    onClick={() => setIsGenresOpen(!isGenresOpen)}
                  />
                </div>
                {isGenresOpen && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {genres.map((genre, index) => (
                      <Link
                        key={index}
                        href={`/genre/${genre
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                      >
                        <span className="block text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium">
                          {genre}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span
                    className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                    onClick={() => setIsTypesOpen(!isTypesOpen)}
                  >
                    Types
                  </span>
                  <PlusIcon
                    className={`h-5 w-5 text-white cursor-pointer transform transition-transform duration-200 ${
                      isTypesOpen ? "rotate-45" : "rotate-0"
                    }`}
                    onClick={() => setIsTypesOpen(!isTypesOpen)}
                  />
                </div>
                {isTypesOpen && (
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {types.map((type, index) => (
                      <Link
                        key={index}
                        href={`/type/${type.toLowerCase().replace(/ /g, "-")}`}
                      >
                        <span className="block text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium">
                          {type}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
             
            </div>
          </div>
        )}

        {/* Search Bar for Mobile */}
        <div className="md:hidden bg-gray-900 p-4 w-full relative">
          <div className="flex items-center flex-1 w-full">
            <input
              type="text"
              placeholder="Search Anime here.... "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full px-3 py-1 bg-gray-700 text-white placeholder-gray-400 focus:outline-none w-full"
            />
            <button className="ml-2 bg-gray-700 text-white px-4 py-1 rounded-full hover:bg-cyan-500">
              <SearchIcon className="h-5 w-5" />
            </button>
            {/* Search Results for Mobile */}
            {searchQuery.length > 0 &&
              mobileSearchResults.length > 0 &&
              windowWidth < 768 && (
                <div className="absolute mt-72 bg-black text-white z-20 w-full max-w-md rounded-lg shadow-lg overflow-hidden">
                  {mobileSearchResults.map((anime) => (
                    <Link
                      key={anime.id}
                      href={`/animeplayer?animeId=${anime.id}`}
                    >
                      <span
                        className="block px-4 py-2 hover:bg-gray-800"
                        onClick={() => {
                          setSearchQuery(""); // Clear the search query
                          setMobileSearchResults([]); // Clear the search results
                        }}
                      >
                        {anime.title.romaji}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
