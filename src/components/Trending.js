// AIzaSyCsyPSEJtUGBBMGslf_vg35mucxXxxnWFI
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const Trending = () => {
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [clips, setClips] = useState([]);
  const [currentClip, setCurrentClip] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const query = `
          query {
            Page(perPage: 50) {
              media(type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                  romaji
                }
                coverImage {
                  medium
                }
              }
            }
          }
        `;

        const response = await axios.post('https://graphql.anilist.co', { query });
        const trendingAnime = response.data.data.Page.media.map(anime => ({
          id: anime.id,
          name: anime.title.romaji,
          image: anime.coverImage.medium,
        }));

        setAnimeList(trendingAnime);
      } catch (error) {
        console.error('Error fetching trending anime:', error);
      }
    };

    fetchTrendingAnime();
  }, []);

  const fetchClips = async (animeName) => {
    try {
      setLoading(true);
      const searchQuery = `${animeName} epic moments`;
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          q: searchQuery,
          part: 'snippet',
          type: 'video',
          key: 'AIzaSyCsyPSEJtUGBBMGslf_vg35mucxXxxnWFI', // Replace with your YouTube API key
          maxResults: 10,
        },
      });

      const clips = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

      setClips(clips);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clips:', error);
      setLoading(false);
    }
  };

  const handleAnimeClick = async (anime) => {
    if (selectedAnime && selectedAnime.id === anime.id) {
      setSelectedAnime(null);
      setClips([]);
    } else {
      setSelectedAnime(anime);
      await fetchClips(anime.name);
    }
  };

  const handleClipClick = (clipUrl) => {
    setCurrentClip(clipUrl);
  };

  return (
    <div className="h-screen p-4 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/4 pr-2 mb-4 lg:mb-0 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Trending Anime</h2>
        <ul className="divide-y divide-gray-200">
          {animeList.map(anime => (
            <div key={anime.id}>
              <li
                className="h-full text-lg mb-2 cursor-pointer flex items-center hover:bg-slate-900"
                onClick={() => handleAnimeClick(anime)}
              >
                <img src={anime.image} alt={anime.name} className="w-14 h-14 object-cover rounded mr-2" />
                <span className="truncate">{anime.name}</span>
                {selectedAnime && selectedAnime.id === anime.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 0 0-1 1v5H4a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5V4a1 1 0 0 0-1-1z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-gray-400 hover:text-gray-600 transition duration-150" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 0 0-1 1v5H4a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5V4a1 1 0 0 0-1-1z" />
                  </svg>
                )}
              </li>
              {selectedAnime && selectedAnime.id === anime.id && (
                <>
                  <div className="lg:hidden pl-8">
                    <h2 className="text-xl font-bold mb-4">{selectedAnime.name} Clips</h2>
                    {loading ? (
                      <div className="flex justify-center items-center h-full w-full">
                        <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full">
                          <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
                        </div>
                      </div>
                    ) : (
                      clips.length > 0 ? (
                        clips.map((clip, index) => (
                          <div
                            key={clip.id}
                            className="p-2 relative w-full"
                            onClick={() => handleClipClick(clip.url)}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            <ReactPlayer
                              url={clip.url}
                              width="100%"
                              height="200px"
                              playing={clip.url === currentClip}
                              controls
                            />
                          </div>
                        ))
                      ) : (
                        <div className="w-full text-center">No clips available</div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </ul>
      </div>
      <div className="w-full h-full lg:w-3/4 pl-2 overflow-y-auto hidden lg:block">
        {selectedAnime && (
          <>
            <h2 className="text-2xl font-bold  mb-4">{selectedAnime.name} Clips</h2>
            <div className="flex flex-wrap">
              {loading ? (
                <div className="flex justify-center items-center h-screen w-full">
                  <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full">
                    <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
                  </div>
                </div>
              ) : (
                clips.length > 0 ? (
                  clips.map((clip, index) => (
                    <div
                      key={clip.id}
                      className="p-2 relative w-full md:w-1/2 lg:w-1/3"
                      onClick={() => handleClipClick(clip.url)}
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      <ReactPlayer
                        url={clip.url}
                        width="100%"
                        height="200px"
                        playing={clip.url === currentClip}
                        controls
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center">No clips available</div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Trending;
