# uTuubLoop

A Next.js application that allows you to watch six YouTube videos simultaneously on a single screen. Each video can be controlled individually, and you can open a separate control window for better management.

## Features

- Display six YouTube videos in a grid layout
- Individual controls for each video (play/pause, speed control)
- Change videos by providing YouTube URLs or video IDs
- Open a separate control window for better management of all videos
- Responsive design that works on various screen sizes

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- React YouTube (for embedding YouTube videos)
- pnpm (package manager)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or other package managers

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/utuubloop.git
   cd utuubloop
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. The main page displays six YouTube videos in a grid layout.
2. Each video has basic controls (play/pause, speed control) below it.
3. You can change a video by entering a YouTube URL or video ID in the input field below the video.
4. Click the "Open Controls in New Window" button at the top to open a separate window with more detailed controls for all videos.
5. Changes made in either window will be synchronized between both windows.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React YouTube](https://github.com/tjallingt/react-youtube)
- [YouTube API](https://developers.google.com/youtube/v3)
