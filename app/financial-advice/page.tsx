"use client";

import { useEffect, useState } from "react";
import Spinner from '../components/Spinner';

// Define TypeScript types for the video data
type Video = {
  title: string;
  videoId: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishDate: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    publishedAt: string;
  };
  id: {
    videoId: string;
  };
};

// Utility function to decode HTML entities
const decodeHTML = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent || "";
};

const FinancialAdvice = () => {
  const [videos, setVideos] = useState<Video[]>([]); // Set initial state as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Make sure the API key is stored correctly
  const query = "financial advice"; // The search keyword
  const maxResults = 6; // Number of results to fetch
  const sortBy = "viewCount"; // Sorting by most viewed

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&order=${sortBy}&type=video&maxResults=${maxResults}&key=${API_KEY}`
        );
        const data = await response.json();

        // Map through the data.items and extract relevant fields
        const formattedVideos: Video[] = data.items.map((item: Video) => ({
          title: decodeHTML(item.snippet.title), // Decode HTML entities here
          videoId: item.id.videoId,
          channelTitle: item.snippet.channelTitle,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          publishDate: item.snippet.publishedAt,
        }));

        setVideos(formattedVideos); // Update state with the decoded video data
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [API_KEY]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-xl text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Financial Advice Section */}
      <section className="bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg p-8 mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
          Practical Financial Advice for Your Future
        </h2>
        <p className="text-lg sm:text-xl font-light leading-relaxed">
          Financial freedom starts with understanding the basics of money management and making informed decisions. Here are a few tips to set you on the right path:
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-teal-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.1 0-1.99.89-1.99 1.99 0 .56.23 1.06.59 1.42l4.01 4.02c.36.36.86.59 1.42.59.55 0 1.06-.23 1.41-.59.36-.36.59-.86.59-1.42 0-1.1-.89-1.99-1.99-1.99h-2.8V8h-2.4v2h-2.8c-1.1 0-1.99.89-1.99 1.99 0 .56.23 1.06.59 1.42l4.01 4.02c.36.36.86.59 1.42.59.55 0 1.06-.23 1.41-.59l4.01-4.02c.36-.36.59-.86.59-1.42C13.99 8.89 13.1 8 12 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Create a Budget</h3>
              <p className="text-sm font-light">
                The foundation of personal finance is knowing where your money goes. Track income, expenses, and create a realistic budget.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-teal-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 5c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2-.9-2-2-2zm0 8c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2-.9-2-2-2zm0 8c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2-.9-2-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Build an Emergency Fund</h3>
              <p className="text-sm font-light">
                Having 3-6 months of living expenses saved can provide peace of mind and protect you in case of unexpected situations.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-teal-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 1v6m0 12v6m9-9H3"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Invest for the Long-Term</h3>
              <p className="text-sm font-light">
                Time is one of the most powerful tools in investing. Begin investing early, focus on diversification, and stay patient.
              </p>
            </div>
          </div>
        </div>
      </section>

      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
        Financial Advice Videos
      </h1>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div key={video.videoId} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* YouTube Video Embed */}
            <div className="video-container relative pb-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
                aria-label={`Watch ${video.title} on YouTube`}
              ></iframe>
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{video.title}</h2>
              <p className="text-sm text-gray-500 mt-2">Channel: {video.channelTitle}</p>
              <p className="text-sm text-gray-500 mt-1">
                Published on: {new Date(video.publishDate).toLocaleDateString()}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialAdvice;
