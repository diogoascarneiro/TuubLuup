import { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";

// Default video IDs (you can replace these with any YouTube video IDs)
const DEFAULT_VIDEOS = [
  "dQw4w9WgXcQ", // Rick Astley - Never Gonna Give You Up
  "jNQXAC9IVRw", // Me at the zoo (first YouTube video)
  "9bZkp7q19f0", // PSY - Gangnam Style
  "kJQP7kiw5Fk", // Luis Fonsi - Despacito
  "OPf0YbXqDm0", // Mark Ronson - Uptown Funk
  "JGwWNGJdvx8", // Ed Sheeran - Shape of You
];

const VideoGrid = () => {
  const [videoIds, setVideoIds] = useState<string[]>(DEFAULT_VIDEOS);

  useEffect(() => {
    // Listen for messages from the controls window
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "VIDEO_CHANGE") {
        const { index, videoId } = event.data;
        if (typeof index === "number" && videoId && index >= 0 && index < videoIds.length) {
          const newVideoIds = [...videoIds];
          newVideoIds[index] = videoId;
          setVideoIds(newVideoIds);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [videoIds]);

  const handleVideoChange = (index: number, newVideoId: string) => {
    const newVideoIds = [...videoIds];
    newVideoIds[index] = newVideoId;
    setVideoIds(newVideoIds);
  };

  const openControlsWindow = () => {
    if (typeof window !== "undefined") {
      const controlsUrl = `${window.location.origin}/controls?videos=${encodeURIComponent(JSON.stringify(videoIds))}`;
      window.open(controlsUrl, "VideoControls", "width=800,height=600");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">uTuubLoop</h1>
        <button onClick={openControlsWindow} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
          Open Controls in New Window
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 flex-grow bg-black">
        {videoIds.map((videoId, index) => (
          <div key={index} className="h-full">
            <VideoPlayer videoId={videoId} onVideoIdChange={(newId) => handleVideoChange(index, newId)} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
