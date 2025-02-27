import { useState } from "react";
import YouTube, { YouTubePlayer, YouTubeEvent } from "react-youtube";

interface VideoControlsProps {
  videoId: string;
  index: number;
  onVideoIdChange: (newId: string) => void;
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

const VideoControls = ({ videoId, index, onVideoIdChange }: VideoControlsProps) => {
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
    height: "180",
    width: "320",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-3">Video {index + 1}</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full"
          />
        </div>

        <div className="w-full md:w-2/3">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={togglePlay} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                {isPlaying ? "Pause" : "Play"}
              </button>

              <div className="flex items-center">
                <span className="mr-2">Speed:</span>
                <select
                  value={playbackRate}
                  onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                  className="bg-gray-700 rounded px-2 py-2">
                  {playbackRates.map((rate) => (
                    <option key={rate} value={rate}>
                      {rate}x
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <form onSubmit={handleVideoChange} className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="YouTube URL or video ID"
              className="flex-grow px-3 py-2 bg-gray-700 rounded md:rounded-r-none text-white"
            />
            <button type="submit" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded md:rounded-l-none">
              Change Video
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
