import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const AnimePlayer = () => {
  const router = useRouter();
  const { animeId } = router.query;
  const [animeDetails, setAnimeDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    if (animeId) {
      const fetchAnimeDetails = async () => {
        try {
          const query = `
            query ($id: Int) {
              Media(id: $id, type: ANIME) {
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  large
                }
                description
                genres
                episodes
                season
                startDate {
                  year
                }
                averageScore
                popularity
                trailer {
                  site
                  id
                }
                characters {
                  edges {
                    node {
                      name {
                        full
                      }
                    }
                    role
                  }
                }
                staff {
                  edges {
                    node {
                      name {
                        full
                      }
                    }
                    role
                  }
                }
              }
            }
          `;

          const response = await axios.post('https://graphql.anilist.co', {
            query: query,
            variables: { id: parseInt(animeId) },
          });

          const anime = response.data.data.Media;
          setAnimeDetails(anime);

          if (anime.trailer && anime.trailer.site === 'youtube') {
            setTrailerUrl(`https://www.youtube.com/watch?v=${anime.trailer.id}`);
          } else {
            searchForTrailer(anime.title.romaji);
          }
        } catch (error) {
          console.error('Error fetching anime details:', error);
        }
      };

      fetchAnimeDetails();
    }
  }, [animeId]);

  const searchForTrailer = async (title) => {
    try {
      const searchQuery = `${title} anime trailer`;
      
      const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          q: searchQuery,
          part: 'snippet',
          type: 'video',
          key: 'AIzaSyCsyPSEJtUGBBMGslf_vg35mucxXxxnWFI', // Replace with your YouTube API key
        }
      });

      if (youtubeResponse.data.items.length > 0) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${youtubeResponse.data.items[0].id.videoId}`);
      } else {
        const googleResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            q: searchQuery,
            cx: 'AIzaSyBJgvwIY2XP4-8SFA33I-KpxEZjOdtuEFo', // Replace with your Google Custom Search Engine ID
            key: 'YOUR_GOOGLE_API_KEY', // Replace with your Google API key
            searchType: 'video',
          }
        });

        if (googleResponse.data.items.length > 0) {
          setTrailerUrl(googleResponse.data.items[0].link);
        } else {
          console.error('No trailer found');
        }
      }
    } catch (error) {
      console.error('Error searching for trailer:', error);
    }
  };

  if (!animeDetails) {
    return <div>Loading...</div>;
  }

  const { title, coverImage, description, genres, episodes, season, startDate, averageScore, popularity, characters, staff } = animeDetails;
  const director = staff.edges.find(edge => edge.role.toLowerCase().includes('director'))?.node.name.full || 'N/A';

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="flex flex-col lg:flex-row justify-center w-full mb-5">
        <div className="w-full lg:w-1/2 pr-2 mb-4 lg:mb-0 flex justify-center">
          <div className="lg:w-3/4 lg:h-96 border lg:border-gray-300 shadow-lg p-2">
            <img
              className="w-full h-full object-contain"
              src={coverImage.large}
              alt={title.romaji}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:pl-10 max-h-96 overflow-y-auto">
          <h1 className="text-2xl lg:text-4xl font-bold mb-4">{title.romaji}</h1>
          <p className="mb-2">Number of episodes: {episodes || 'N/A'}</p>
          <p className="mb-2">Season: {season || 'N/A'}</p>
          <p className="mb-2">Director: {director}</p>
          <p className="mb-2">Aired: {startDate.year}</p>
          <p className="mb-2">Average Score: {averageScore || 'N/A'}</p>
          <p className="mb-2">Popularity: {popularity || 'N/A'}</p>
          <p className="mb-2">Genres: {genres.join(', ') || 'N/A'}</p>
          <p className="mb-2">Description: {description || 'N/A'}</p>
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Characters:</h2>
            <ul>
              {characters.edges.map((character, index) => (
                <li key={index} className="mb-1">
                  {character.node.name.full} ({character.role})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {trailerUrl && (
        <div className="z-20 w-full mt-4 relative" style={{ width:'98%', height: '70vh' }}>
          <ReactPlayer url={trailerUrl} width="100%" height="100%" controls />
          {/* <div className="absolute inset-0 border-4 z-0 border-blue-500 animate-pulse"></div> */}
        </div>
      )}
    </div>
  );
};

export default AnimePlayer;
