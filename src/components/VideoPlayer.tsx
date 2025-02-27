import { useState, useEffect } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

interface VideoPlayerProps {
  videoId: string;
  index: number;
}

interface Options {
  height: string | number;
  width: string | number;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    modestbranding?: 0 | 1;
    [key: string]: string | number | undefined;
  };
}

interface LoopSettings {
  enabled: boolean;
  startTime: number;
  endTime: number;
}

const VideoPlayer = ({ videoId, index }: VideoPlayerProps) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [loopSettings, setLoopSettings] = useState<LoopSettings>({
    enabled: false,
    startTime: 0,
    endTime: 0,
  });

  const onReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };

  // Check if video needs to loop
  useEffect(() => {
    if (!player || !loopSettings.enabled) return;

    const checkTime = () => {
      const currentTime = player.getCurrentTime();
      if (currentTime >= loopSettings.endTime) {
        player.seekTo(loopSettings.startTime, true);
      }
    };

    // Check every 200ms if we need to loop
    const intervalId = setInterval(checkTime, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, [player, loopSettings]);

  useEffect(() => {
    // Listen for messages from the controls window
    const handleMessage = (event: MessageEvent) => {
      if (!player || !event.data || typeof event.data !== "object" || event.data.index !== index) {
        return;
      }

      switch (event.data.type) {
        case "VIDEO_PLAY":
          player.playVideo();
          break;
        case "VIDEO_PAUSE":
          player.pauseVideo();
          break;
        case "VIDEO_SPEED":
          if (typeof event.data.speed === "number") {
            player.setPlaybackRate(event.data.speed);
          }
          break;
        case "VIDEO_LOOP_SETTINGS":
          if (typeof event.data.loopSettings === "object") {
            setLoopSettings(event.data.loopSettings);
          }
          break;
        case "VIDEO_SEEK":
          if (typeof event.data.time === "number") {
            player.seekTo(event.data.time, true);
          }
          break;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [player, index]);

  const opts: Options = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow">
        <YouTube videoId={videoId} opts={opts} onReady={onReady} className="h-full w-full" />
        {/* Transparent overlay to prevent direct interaction with the video */}
        <div className="absolute inset-0 z-10" />
        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded z-20">Video {index + 1}</div>
        {loopSettings.enabled && (
          <div className="absolute bottom-2 right-2 bg-purple-600/70 text-white px-2 py-1 rounded text-xs z-20">
            Loop: {Math.floor(loopSettings.startTime)}s → {Math.floor(loopSettings.endTime)}s
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
