import { useState, useEffect } from "react";
import YouTube, { YouTubePlayer, YouTubeEvent } from "react-youtube";

interface VideoControlsProps {
  videoId: string;
  index: number;
  onVideoIdChange: (newId: string) => void;
}

interface LoopSettings {
  enabled: boolean;
  startTime: number;
  endTime: number;
}

const VideoControls = ({ videoId, index, onVideoIdChange }: VideoControlsProps) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [loopSettings, setLoopSettings] = useState<LoopSettings>({
    enabled: false,
    startTime: 0,
    endTime: 0,
  });

  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);

    // Ensure the hidden player is paused
    event.target.pauseVideo();
    event.target.mute();

    // Get video title when player is ready
    const title = event.target.getVideoData().title;
    setVideoTitle(title || `Video ${index + 1}`);

    // Get video duration
    const duration = event.target.getDuration();
    setVideoDuration(duration);

    // Initialize end time to video duration
    setLoopSettings((prev) => ({
      ...prev,
      endTime: duration,
    }));
  };

  // Update current time periodically
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      const rawTime = player.getCurrentTime();

      // If looping is enabled, adjust the displayed time to show position within the loop
      if (loopSettings.enabled && rawTime >= loopSettings.startTime) {
        // Calculate relative position within the loop
        const loopDuration = loopSettings.endTime - loopSettings.startTime;
        if (loopDuration > 0) {
          // When we're in the loop region, show time relative to loop start
          const relativeTime = ((rawTime - loopSettings.startTime) % loopDuration) + loopSettings.startTime;
          setCurrentTime(relativeTime);
        } else {
          setCurrentTime(rawTime);
        }
      } else {
        setCurrentTime(rawTime);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [player, loopSettings]);

  // Send message to parent window
  const sendMessageToParent = (type: string, data: Record<string, unknown> = {}) => {
    if (typeof window !== "undefined" && window.opener) {
      window.opener.postMessage(
        {
          type,
          index,
          ...data,
        },
        "*"
      );
    }
  };

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        // Don't pause the hidden player, just send message
        // player.pauseVideo();
        sendMessageToParent("VIDEO_PAUSE");
      } else {
        // Don't play the hidden player, just send message
        // player.playVideo();
        sendMessageToParent("VIDEO_PLAY");
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (player) {
      // Don't change the hidden player's playback rate
      // player.setPlaybackRate(rate);
      setPlaybackRate(rate);
      sendMessageToParent("VIDEO_SPEED", { speed: rate });
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

  // Set current time as loop start point
  const setLoopStart = () => {
    if (!player) return;

    const time = player.getCurrentTime();
    updateLoopSettings({
      ...loopSettings,
      startTime: time,
      enabled: true,
    });
  };

  // Set current time as loop end point
  const setLoopEnd = () => {
    if (!player) return;

    const time = player.getCurrentTime();
    updateLoopSettings({
      ...loopSettings,
      endTime: time,
      enabled: true,
    });
  };

  // Update loop settings and send to main window
  const updateLoopSettings = (newSettings: LoopSettings) => {
    // Ensure start time is before end time
    if (newSettings.startTime >= newSettings.endTime) {
      if (newSettings.startTime > loopSettings.startTime) {
        // If start time was increased, adjust end time
        newSettings.endTime = Math.min(newSettings.startTime + 5, videoDuration);
      } else {
        // If end time was decreased, adjust start time
        newSettings.startTime = Math.max(0, newSettings.endTime - 5);
      }
    }

    setLoopSettings(newSettings);
    sendMessageToParent("VIDEO_LOOP_SETTINGS", { loopSettings: newSettings });
  };

  // Toggle loop on/off
  const toggleLoop = () => {
    const newSettings = {
      ...loopSettings,
      enabled: !loopSettings.enabled,
    };

    setLoopSettings(newSettings);
    sendMessageToParent("VIDEO_LOOP_SETTINGS", { loopSettings: newSettings });
  };

  // Handle slider change for start time
  const handleStartSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = parseFloat(e.target.value);
    updateLoopSettings({
      ...loopSettings,
      startTime: newStartTime,
      enabled: true,
    });
  };

  // Handle slider change for end time
  const handleEndSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = parseFloat(e.target.value);
    updateLoopSettings({
      ...loopSettings,
      endTime: newEndTime,
      enabled: true,
    });
  };

  // Seek to a specific time
  const seekTo = (time: number) => {
    if (player) {
      // Don't seek in the hidden player
      // player.seekTo(time, true);

      // Send message to parent window to seek
      sendMessageToParent("VIDEO_SEEK", { time });
    }
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate percentage for progress bar
  const calculateProgress = (time: number): number => {
    if (videoDuration <= 0) return 0;
    return (time / videoDuration) * 100;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-3">Video {index + 1}</h2>

      <div className="flex flex-col gap-4">
        {/* Hidden YouTube player to control the video and get metadata */}
        <div className="hidden">
          <YouTube
            videoId={videoId}
            onReady={onReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            opts={{
              height: "1",
              width: "1",
              playerVars: {
                autoplay: 0,
                controls: 0,
                mute: 1,
                playsinline: 1,
                modestbranding: 1,
              },
            }}
          />
        </div>

        <div className="w-full">
          <div className="mb-4">
            <div className="flex flex-col gap-2">
              <div className="bg-gray-700 p-3 rounded">
                <p className="font-medium">Title: {videoTitle || "Loading..."}</p>
                <p className="text-sm text-gray-300 mt-1">Status: {isPlaying ? "Playing" : "Paused"}</p>
                <p className="text-sm text-gray-300">Speed: {playbackRate}x</p>
                <p className="text-sm text-gray-300">
                  Time: {formatTime(currentTime)} / {formatTime(videoDuration)}
                </p>
              </div>

              {/* Video Progress Bar */}
              <div
                className="mt-2 mb-2 relative h-8 bg-gray-700 rounded overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;

                  // If looping is enabled and clicking within the loop region visualization,
                  // calculate time relative to the loop
                  if (
                    loopSettings.enabled &&
                    percentage >= calculateProgress(loopSettings.startTime) / 100 &&
                    percentage <= calculateProgress(loopSettings.endTime) / 100
                  ) {
                    const loopPercentage =
                      (percentage - calculateProgress(loopSettings.startTime) / 100) /
                      ((calculateProgress(loopSettings.endTime) - calculateProgress(loopSettings.startTime)) / 100);
                    const time =
                      loopSettings.startTime + loopPercentage * (loopSettings.endTime - loopSettings.startTime);
                    seekTo(time);
                  } else {
                    const time = percentage * videoDuration;
                    seekTo(time);
                  }
                }}>
                {/* Background for loop region */}
                {videoDuration > 0 && loopSettings.enabled && (
                  <div
                    className="absolute top-0 h-full bg-gray-600"
                    style={{
                      left: `${calculateProgress(loopSettings.startTime)}%`,
                      width: `${calculateProgress(loopSettings.endTime - loopSettings.startTime)}%`,
                    }}></div>
                )}

                {/* Progress bar */}
                <div
                  className="absolute top-0 left-0 h-full bg-blue-600 opacity-50"
                  style={{ width: `${calculateProgress(currentTime)}%` }}></div>

                {/* Loop region indicator */}
                {videoDuration > 0 && (
                  <div
                    className={`absolute top-0 h-full ${loopSettings.enabled ? "bg-purple-600" : "bg-purple-600/30"}`}
                    style={{
                      left: `${calculateProgress(loopSettings.startTime)}%`,
                      width: `${calculateProgress(loopSettings.endTime - loopSettings.startTime)}%`,
                      opacity: loopSettings.enabled ? 0.5 : 0.3,
                      borderLeft: "2px solid white",
                      borderRight: "2px solid white",
                    }}></div>
                )}

                {/* Current time marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-white"
                  style={{ left: `${calculateProgress(currentTime)}%` }}></div>

                {/* Loop markers */}
                {videoDuration > 0 && (
                  <>
                    <div
                      className="absolute top-0 h-full w-1 bg-green-500"
                      style={{ left: `${calculateProgress(loopSettings.startTime)}%`, opacity: 0.8 }}></div>
                    <div
                      className="absolute top-0 h-full w-1 bg-red-500"
                      style={{ left: `${calculateProgress(loopSettings.endTime)}%`, opacity: 0.8 }}></div>
                  </>
                )}

                {/* Time labels */}
                <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-between items-center px-2 text-xs text-white">
                  <span>{formatTime(0)}</span>
                  {loopSettings.enabled && (
                    <span className="bg-purple-800 px-1 py-0.5 rounded">
                      Loop: {formatTime(loopSettings.endTime - loopSettings.startTime)}
                    </span>
                  )}
                  <span>{formatTime(videoDuration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
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

              {/* Loop Controls */}
              <div className="mt-3 bg-gray-700 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Loop Controls</h3>
                  <button
                    onClick={toggleLoop}
                    className={`px-3 py-1 rounded text-sm ${
                      loopSettings.enabled ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 hover:bg-gray-500"
                    }`}>
                    {loopSettings.enabled ? "Loop ON" : "Loop OFF"}
                  </button>
                </div>

                {/* Loop Range Sliders */}
                <div className="mt-4 mb-2">
                  <div className="flex items-center mb-2">
                    <span className="text-sm w-16">Start: </span>
                    <input
                      type="range"
                      min="0"
                      max={videoDuration}
                      step="0.1"
                      value={loopSettings.startTime}
                      onChange={handleStartSliderChange}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm ml-2 w-16">{formatTime(loopSettings.startTime)}</span>
                    <button
                      onClick={setLoopStart}
                      className="ml-2 bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs">
                      Set
                    </button>
                  </div>

                  <div className="flex items-center">
                    <span className="text-sm w-16">End: </span>
                    <input
                      type="range"
                      min="0"
                      max={videoDuration}
                      step="0.1"
                      value={loopSettings.endTime}
                      onChange={handleEndSliderChange}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm ml-2 w-16">{formatTime(loopSettings.endTime)}</span>
                    <button onClick={setLoopEnd} className="ml-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs">
                      Set
                    </button>
                  </div>
                </div>

                {loopSettings.enabled && (
                  <div className="mt-2 text-xs text-gray-300">
                    Looping from {formatTime(loopSettings.startTime)} to {formatTime(loopSettings.endTime)}
                  </div>
                )}
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
