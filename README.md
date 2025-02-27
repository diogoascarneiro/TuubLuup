# TuubLuup

A Next.js application designed for VJs and sound artists to create immersive audiovisual experiences using YouTube videos as source material. TuubLuup allows you to display multiple YouTube videos simultaneously, creating a dynamic visual canvas for live performances, installations, or experimental sound exploration.

## Features

- Display multiple YouTube videos (1-8) in a customizable grid layout
- Adaptive layout that optimizes space for odd numbers of videos
- Individual controls for each video (play/pause, speed control)
- Change videos by providing YouTube URLs or video IDs
- Separate control window for better management during performances
- Auto-hiding interface for distraction-free visual experiences
- Responsive design that works on various screen sizes

## Perfect for

- VJs looking for a simple multi-video mixing tool
- Sound artists exploring visual accompaniments
- Audiovisual performances and installations
- Experimental music production with visual elements
- Live streaming with multiple video sources
- Interactive art installations

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
   git clone https://github.com/yourusername/tuubluup.git
   cd tuubluup
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

1. Start by selecting how many videos you want to display (1-8)
2. The main window displays your selected videos in an optimized grid layout
3. Move your mouse to the top of the screen to reveal the control bar
4. Click "Open Controls" to launch a separate window for managing all videos
5. In the control window, you can:
   - Change video URLs/IDs
   - Adjust playback speed
   - Play/pause individual videos
   - See video titles and current status
6. Changes made in the control window are instantly reflected in the main display

## Performance Tips

- For optimal performance during VJ sets, preload your videos before your performance
- Use shorter, high-energy clips for more dynamic visuals
- Experiment with different playback speeds to create interesting visual textures
- For installations, consider videos with slower movements or ambient qualities
- Use odd numbers of videos (3, 5, 7) to create asymmetrical visual interest

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React YouTube](https://github.com/tjallingt/react-youtube)
- [YouTube API](https://developers.google.com/youtube/v3)
