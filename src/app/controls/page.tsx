"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VideoControls from "../../components/VideoControls";

export default function ControlsPage() {
  const searchParams = useSearchParams();
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [videoTitles, setVideoTitles] = useState<string[]>([]);

  useEffect(() => {
    const videosParam = searchParams.get("videos");
    if (videosParam) {
      try {
        const parsedVideos = JSON.parse(decodeURIComponent(videosParam));
        setVideoIds(parsedVideos);
        // Initialize video titles with default values
        setVideoTitles(parsedVideos.map((_: string, i: number) => `Video ${i + 1}`));
      } catch (error) {
        console.error("Failed to parse video IDs:", error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  // Function to update video title
  const updateVideoTitle = (index: number, title: string) => {
    const newTitles = [...videoTitles];
    newTitles[index] = title;
    setVideoTitles(newTitles);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (videoIds.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-gray-800 border border-gray-700 text-white px-6 py-5 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold mb-3">No Videos Found</h2>
          <p className="text-gray-300 mb-4">No videos were detected. Please return to the main page and try again.</p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                if (window.opener) {
                  window.opener.location.href = "/";
                }
                window.close();
              }
            }}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
            Return to Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">TuubLuup Controls</h1>
      <p className="mb-4 text-gray-300">
        Control all videos from this window. Changes will be reflected in the main window.
      </p>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
        {videoIds.map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-medium truncate max-w-xs ${
              activeTab === index
                ? "text-white border-b-2 border-purple-500 bg-gray-800"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
            onClick={() => setActiveTab(index)}
            title={videoTitles[index]}>
            <span className="inline-block w-6 h-6 text-sm rounded-full bg-purple-600 mr-2 text-center">
              {index + 1}
            </span>
            {videoTitles[index]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {videoIds.map((videoId, index) => (
          <div key={index} className={activeTab === index ? "block" : "hidden"}>
            <VideoControls
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
              onTitleChange={(title: string) => updateVideoTitle(index, title)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={() => window.close()} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          Close Controls
        </button>
      </div>
    </div>
  );
}
