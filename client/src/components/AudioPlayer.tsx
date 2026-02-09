import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2, X, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  slug: string;
  sectionTitle: string;
  onClose: () => void;
}

export function AudioPlayer({ slug, sectionTitle, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  const fetchAudio = useCallback(async () => {
    if (audioUrl) return audioUrl;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to generate audio");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      return url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Audio generation failed";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [slug, audioUrl]);

  const togglePlay = async () => {
    if (isLoading) return;

    if (!audioRef.current?.src || !audioUrl) {
      const url = await fetchAudio();
      if (!url) return;

      if (!audioRef.current) {
        const audio = new Audio();
        audio.preload = "auto";
        audio.playbackRate = speed;
        audio.muted = isMuted;

        audio.addEventListener("loadedmetadata", () => {
          setDuration(audio.duration);
        });

        audio.addEventListener("ended", () => {
          setIsPlaying(false);
          setProgress(100);
        });

        audio.addEventListener("error", () => {
          setError("Playback error");
          setIsPlaying(false);
        });

        audioRef.current = audio;
        audio.src = url;

        await new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("error", onError);
            resolve();
          };
          const onError = () => {
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("error", onError);
            reject(new Error("Failed to load audio"));
          };
          audio.addEventListener("canplay", onCanPlay);
          audio.addEventListener("error", onError);
        });
      }
    }

    setError(null);

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch {
        setError("Click play again to start");
      }
    }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          const ct = audioRef.current.currentTime;
          const dur = audioRef.current.duration;
          setCurrentTime(ct);
          if (dur > 0) {
            setProgress((ct / dur) * 100);
          }
        }
      }, 250);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    audioRef.current.currentTime = pct * duration;
    setProgress(pct * 100);
    setCurrentTime(pct * duration);
  };

  const cycleSpeed = () => {
    const currentIdx = speeds.indexOf(speed);
    const nextIdx = (currentIdx + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50"
        data-testid="audio-player"
      >
        <div className="audio-player-bar">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div
              className="audio-progress-track mb-3 cursor-pointer"
              onClick={handleProgressClick}
              data-testid="audio-progress-bar"
            >
              <div
                className="audio-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className={cn(
                    "audio-control-btn flex-shrink-0",
                    isLoading && "opacity-50"
                  )}
                  data-testid="button-audio-play"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-3 h-3 text-accent/60 flex-shrink-0" />
                    <span className="text-xs font-sans text-foreground/80 truncate max-w-[200px] md:max-w-[350px]">
                      {sectionTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {duration > 0
                        ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                        : isLoading
                        ? "Generating..."
                        : "Ready"}
                    </span>
                    {error && (
                      <span className="font-mono text-[10px] text-destructive/80">
                        {error}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={cycleSpeed}
                  className="audio-speed-btn"
                  data-testid="button-audio-speed"
                >
                  {speed}x
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="audio-control-btn-sm"
                  data-testid="button-audio-mute"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                <a
                  href="https://speechify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="audio-powered-by hidden md:inline-flex"
                  data-testid="link-speechify"
                >
                  SPEECHIFY
                </a>

                <button
                  onClick={onClose}
                  className="audio-control-btn-sm"
                  data-testid="button-audio-close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
