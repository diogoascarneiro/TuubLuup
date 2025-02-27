"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VideoControls from "../../components/VideoControls";

export default function ControlsPage() {
  const searchParams = useSearchParams();
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videosParam = searchParams.get("videos");
    if (videosParam) {
      try {
        const parsedVideos = JSON.parse(decodeURIComponent(videosParam));
        setVideoIds(parsedVideos);
      } catch (error) {
        console.error("Failed to parse video IDs:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (videoIds.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          No videos found. Please return to the main page and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Video Controls</h1>
      <div className="grid gap-4">
        {videoIds.map((videoId, index) => (
          <VideoControls
            key={index}
            videoId={videoId}
            index={index}
            onVideoIdChange={(newId: string) => {
              const newVideoIds = [...videoIds];
              newVideoIds[index] = newId;
              setVideoIds(newVideoIds);

              // Send message to parent window to update the video
              if (typeof window !== "undefined" && window.opener) {
                window.opener.postMessage(
                  {
                    type: "VIDEO_CHANGE",
                    index,
                    videoId: newId,
                  },
                  "*"
                );
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
