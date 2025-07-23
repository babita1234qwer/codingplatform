import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!thumbnailUrl && video) {
      const handleLoadedData = () => {
        video.currentTime = 0.1; // Try a very early frame
      };
      const handleSeeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setGeneratedThumbnail(canvas.toDataURL('image/jpeg'));
      };
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('seeked', handleSeeked);
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('seeked', handleSeeked);
      };
    }
  }, [secureUrl, thumbnailUrl]);

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {
        (!thumbnailUrl && !generatedThumbnail)
          ? <div className="w-full aspect-video bg-black flex items-center justify-center">Loading thumbnail...</div>
          : (
            <video
              ref={videoRef}
              src={secureUrl}
              poster={thumbnailUrl || generatedThumbnail}
              onClick={togglePlayPause}
              className="w-full aspect-video bg-black cursor-pointer"
              crossOrigin="anonymous"
            />
          )
      }
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
          isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={togglePlayPause}
          className="btn btn-circle btn-primary mr-3"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause/>
          ) : (
            <Play/>
          )}
        </button>
        <div className="flex items-center w-full mt-2">
          <span className="text-white text-sm mr-2">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="range range-primary range-xs flex-1"
          />
          <span className="text-white text-sm ml-2">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Editorial;