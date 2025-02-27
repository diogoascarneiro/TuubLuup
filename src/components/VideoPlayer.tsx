import { useState } from "react";
import YouTube, { YouTubePlayer, YouTubeEvent } from "react-youtube";

interface VideoPlayerProps {
  videoId: string;
  onVideoIdChange: (videoId: string) => void;
  index: number;
}

interface Options {
  height: string | number;
  width: string | number;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    modestbranding?: 0 | 1;
    [key: string]: string | number | undefined;
  };
}

const VideoPlayer = ({ videoId, onVideoIdChange, index }: VideoPlayerProps) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [newVideoUrl, setNewVideoUrl] = useState("");

  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
  };

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (player) {
      player.setPlaybackRate(rate);
      setPlaybackRate(rate);
    }
  };

  const handleVideoChange = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract video ID from URL
    let newId = newVideoUrl;

    // Handle full YouTube URLs
    const urlRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = newVideoUrl.match(urlRegex);

    if (match && match[1]) {
      newId = match[1];
    }

    onVideoIdChange(newId);
    setNewVideoUrl("");
  };

  const opts: Options = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="h-full w-full"
        />
        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded">Video {index + 1}</div>
      </div>

      <div className="bg-gray-800 p-2 text-white">
        <div className="flex items-center justify-between mb-2">
          <button onClick={togglePlay} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">
            {isPlaying ? "Pause" : "Play"}
          </button>

          <div className="flex items-center">
            <span className="mr-2">Speed:</span>
            <select
              value={playbackRate}
              onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
              className="bg-gray-700 rounded px-2 py-1">
              {playbackRates.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}x
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleVideoChange} className="flex">
          <input
            type="text"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            placeholder="YouTube URL or video ID"
            className="flex-grow px-2 py-1 bg-gray-700 rounded-l text-white"
          />
          <button type="submit" className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-r">
            Change
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoPlayer;
