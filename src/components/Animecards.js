import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const AnimeCards = () => {
  const [animeList, setAnimeList] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [mostViewedAnime, setMostViewedAnime] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        // Fetch top anime airing
        const query = `
          query {
            Page(perPage: 15) {
              media(type: ANIME, sort: TRENDING_DESC) {
                id
                title {
                  english
                }
                coverImage {
                  large
                }
              }
            }
          }
        `;

        const response = await axios.post('https://graphql.anilist.co', {
          query: query,
        });

        setAnimeList(response.data.data.Page.media);

        // Fetch most popular anime
        const popularQuery = `
          query {
            Page(perPage: 10) {
              media(type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                  english
                }
                coverImage {
                  large
                }
              }
            }
          }
        `;

        const popularResponse = await axios.post('https://graphql.anilist.co', {
          query: popularQuery,
        });

        setPopularAnime(popularResponse.data.data.Page.media);

        // Fetch most viewed anime
        const mostViewedQuery = `
          query {
            Page(perPage: 10) {
              media(type: ANIME, sort: FAVOURITES_DESC) {
                id
                title {
                  english
                }
                coverImage {
                  large
                }
              }
            }
          }
        `;

        const mostViewedResponse = await axios.post('https://graphql.anilist.co', {
          query: mostViewedQuery,
        });

        setMostViewedAnime(mostViewedResponse.data.data.Page.media);

        // Fetch popular anime movies
        const moviesQuery = `
          query {
            Page(perPage: 10) {
              media(type: ANIME, format: MOVIE, sort: POPULARITY_DESC) {
                id
                title {
                  english
                }
                coverImage {
                  large
                }
              }
            }
          }
        `;

        const moviesResponse = await axios.post('https://graphql.anilist.co', {
          query: moviesQuery,
        });

        setPopularMovies(moviesResponse.data.data.Page.media);

        // Fetch trending anime
        const trendingQuery = `
          query {
            Page(perPage: 3) {
              media(type: ANIME, sort: TRENDING_DESC) {
                id
                title {
                  english
                }
                coverImage {
                  large
                }
              }
            }
          }
        `;

        const trendingResponse = await axios.post('https://graphql.anilist.co', {
          query: trendingQuery,
        });

        setTrendingAnime(trendingResponse.data.data.Page.media);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching anime data:', error);
        setIsLoading(false); // Set loading to false in case of error
      }
    };

    fetchAnimeData();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-full relative flex justify-center my-8">
        <div className="relative w-full sm:w-11/12 h-64 sm:h-96">
          <video
            src="/video3.mp4" // Replace with the path to your video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover rounded-md shadow-lg"
          ></video>
        </div>
      </div>

      {isLoading ? (
  <div className="flex justify-center items-center h-screen">
    <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full">
      <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
    </div>
  </div>
) : (
        <div className="flex flex-col items-center w-full">
          {/* Trending Anime */}
          <div className="my-14 m-4 w-full sm:w-11/12 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-12 self-start ml-4">Trending Anime</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 justify-center">
              {trendingAnime.map((anime, index) => (
                <Link key={anime.id} href={`/animeplayer?animeId=${anime.id}`} passHref>
                  <div className="relative cursor-pointer">
                    <div className="w-full sm:w-56 rounded overflow-hidden shadow-lg cursor-pointer relative hover:opacity-60 transition duration-300 ease-in-out">
                      <img className="w-max h-72 object-cover rounded-md" src={anime.coverImage.large} alt={anime.title.english} />
                      <div className="text-2xl w-10 h-10 absolute top-2 left-2 bg-white text-black font-black rounded-md pl-3 pt-1 ">{index + 1}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Anime Airing */}
          <div className="my-14 m-4 w-full sm:w-11/12 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-12 self-start  ml-4">Top Anime Airing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-14 justify-center">
              {animeList.map(anime => (
                <Link key={anime.id} href={`/animeplayer?animeId=${anime.id}`} passHref>
                  <div className="w-full sm:w-56 rounded overflow-hidden shadow-lg cursor-pointer relative">
                    <div className="w-full sm:w-56 rounded overflow-hidden shadow-lg cursor-pointer relative hover:opacity-60 transition duration-300 ease-in-out">
                      <img className="w-max h-96 object-cover" src={anime.coverImage.large} alt={anime.title.english} />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-55 text-white px-4 py-2">
                        <span className="text-lg font-bold">{anime.title.english}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Most Popular Anime */}
          <div className="my-24 m-4 w-full sm:w-11/12 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-12 self-start  ml-4">Most Popular Anime</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-14 justify-center">
              {popularAnime.map(anime => (
                <Link key={anime.id} href={`/animeplayer?animeId=${anime.id}`} passHref>
                  <div className="w-full sm:w-56 rounded overflow-hidden shadow-lg cursor-pointer relative">
                    <div className="w-full sm:w-56 rounded overflow-hidden shadow-lg cursor-pointer relative hover:opacity-60 transition duration-300 ease-in-out">
                      <img className="w-full h-96 object-cover" src={anime.coverImage.large} alt={anime.title.english} />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-55 text-white px-4 py-2">
                        <span className="text-lg font-bold">{anime.title.english}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Most Viewed Anime */}
          <div className="my-24 m-4 w-full sm:w-11/12 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-12 self-start  ml-4">Most Viewed Anime</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-14 justify-center">
              {mostViewedAnime.map(anime => (
                <Link key={anime.id} href={`/animeplayer?animeId=${anime.id}`} passHref>
                  <div className="w-full sm:w-56 rounded overflow-hidden shadow-lg cursor-pointer relative">
                    <div className="w-full sm:w-56 rounded overflow-hidden shadow-lg cursor-pointer relative hover:opacity-60 transition duration-300 ease-in-out">
                      <img className="w-full h-96 object-cover" src={anime.coverImage.large} alt={anime.title.english} />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-55 text-white px-4 py-2">
                        <span className="text-lg font-bold">{anime.title.english}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Anime Movies */}
          <div className="my-24 m-4 w-full sm:w-11/12 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-12 self-start  ml-4">Popular Anime Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-14 justify-center">
              {popularMovies.map(anime => (
                <Link key={anime.id} href={`/animeplayer?animeId=${anime.id}`} passHref>
                  <div className="w-full sm:w-56 rounded overflow-hidden shadow-lg cursor-pointer relative">
                    <div className="w-full sm:w-56 rounded overflow-hidden shadow-lg cursor-pointer relative hover:opacity-60 transition duration-300 ease-in-out">
                      <img className="w-full h-96 object-cover" src={anime.coverImage.large} alt={anime.title.english} />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-55 text-white px-4 py-2">
                        <span className="text-lg font-bold">{anime.title.english}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeCards;
