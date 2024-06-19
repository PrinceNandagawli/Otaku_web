import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const AnimeSongs = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [animeSongs, setAnimeSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopAnime = async () => {
      setLoading(true);
      try {
        const query = `
          query {
            Page(perPage: 10) {
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
        const topAnimeData = response.data.data.Page.media;
        setTopAnime(topAnimeData);
      } catch (error) {
        console.error('Error fetching top anime:', error);
      }
      setLoading(false);
    };

    fetchTopAnime();
  }, []);

  const fetchAnimeSongs = async (animeId, animeTitle) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          q: `${animeTitle} opening ending song audio`,
          part: 'snippet',
          type: 'video',
          key: 'AIzaSyCsyPSEJtUGBBMGslf_vg35mucxXxxnWFI', // Replace with your YouTube API key
          maxResults: 10,
        },
      });
      const songs = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));
      setAnimeSongs(songs);
    } catch (error) {
      console.error('Error fetching anime songs:', error);
    }
  };

  const handleShowSongs = async (anime) => {
    try {
      setLoading(true);
      if (selectedAnime && selectedAnime.id === anime.id) {
        setSelectedAnime(null);
        setAnimeSongs([]);
      } else {
        setSelectedAnime(anime);
        await fetchAnimeSongs(anime.id, anime.title.romaji);
      }
    } catch (error) {
      console.error('Error handling anime songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongClick = (songUrl) => {
    setCurrentSong(songUrl);
  };

  return (
    <div className="h-full p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Top Songs</h1>
      {loading ? (
         <div className="flex justify-center items-center h-full w-full">
         <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full">
           <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
         </div>
       </div>
      ) : (
        <ul className="mb-20 overflow-y-auto">
          {topAnime.map(anime => (
            <li key={anime.id} className="mb-4 cursor-pointer hover:bg-gray-900 rounded-lg p-2">
              <div className="flex items-center" onClick={() => handleShowSongs(anime)}>
                <img src={anime.coverImage.medium} alt={anime.title.romaji} className="w-20 h-28 object-cover rounded-lg mr-4" />
                <h2 className="text-xl">{anime.title.romaji}</h2>
              </div>
              {selectedAnime && selectedAnime.id === anime.id && animeSongs.length > 0 && (
                <div className="mt-2 overflow-x-auto border border-gray-300 rounded-lg p-2">
                  <ul className="flex space-x-4">
                    {animeSongs.map((song, index) => (
                      <li key={index} onClick={() => handleSongClick(song.url)} className="cursor-pointer">
                        <img src={`https://img.youtube.com/vi/${song.id}/default.jpg`} alt={song.title} className="w-40 h-24 object-cover rounded border border-gray-300" />
                        <p className="text-sm">{song.title}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-black p-4 shadow-lg">
          <ReactPlayer
            url={currentSong}
            width="100%"
            height="70px"
            playing
            controls
            config={{
              youtube: {
                playerVars: {
                  controls: 1,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AnimeSongs;
