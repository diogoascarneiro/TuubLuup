"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VideoGrid from "../../components/VideoGrid";

export default function VideosPage() {
  const searchParams = useSearchParams();
  const [videoCount, setVideoCount] = useState<number>(6);

  useEffect(() => {
    const countParam = searchParams.get("count");
    if (countParam) {
      const count = parseInt(countParam);
      if (!isNaN(count) && count >= 1 && count <= 8) {
        setVideoCount(count);
      }
    }
  }, [searchParams]);

  return <VideoGrid videoCount={videoCount} />;
}
