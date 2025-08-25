"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Volume2 } from "lucide-react";

interface TranscriptorProps {
  content: string;
  title: string;
}

export default function Transcriptor({ content, title }: TranscriptorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const estimatedDurationRef = useRef<number>(0);
  const currentContentRef = useRef<string>("");

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);

    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice =
          voices.find(
            (voice) =>
              (voice.name.toLowerCase().includes("female") ||
                voice.name.toLowerCase().includes("woman") ||
                voice.name.toLowerCase().includes("samantha") ||
                voice.name.toLowerCase().includes("karen") ||
                voice.name.toLowerCase().includes("susan") ||
                voice.name.toLowerCase().includes("victoria") ||
                voice.name.toLowerCase().includes("google us english female") ||
                voice.name.toLowerCase().includes("microsoft zira")) &&
              voice.lang.startsWith("en")
          ) ||
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              voice.name.toLowerCase().includes("female")
          ) ||
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              !voice.name.toLowerCase().includes("male")
          );

        if (femaleVoice) {
          setSelectedVoice(femaleVoice);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    const newContent = `${title}-${content}`;

    if (
      currentContentRef.current &&
      currentContentRef.current !== newContent &&
      (isPlaying || isPaused)
    ) {
      console.log("[v0] Content changed, stopping audio immediately");
      handleStop();
    }

    currentContentRef.current = newContent;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      handleStop();
    };
  }, [content, title]);

  const drawSineWave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const amplitude = isPlaying ? 15 : 5;
    const frequency = 0.02;
    const time = Date.now() * 0.005;

    ctx.clearRect(0, 0, width, height);

    const waves = [
      { color: "#E92628", alpha: 0.8, offset: 0 },
      { color: "#E92628", alpha: 0.4, offset: Math.PI / 3 },
      { color: "#666666", alpha: 0.3, offset: Math.PI / 2 },
    ];

    waves.forEach((wave) => {
      ctx.beginPath();
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.alpha;
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x++) {
        const y =
          centerY + Math.sin(x * frequency + time + wave.offset) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawSineWave);
    }
  }, [isPlaying]);

  const startProgressTracking = useCallback((duration: number) => {
    startTimeRef.current = Date.now();
    estimatedDurationRef.current = duration;
    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressPercent);

      if (progressPercent >= 100) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    }, 100);
  }, []);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const cleanContent = (htmlContent: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handlePlay = () => {
    if (!isSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      drawSineWave();
      return;
    }

    window.speechSynthesis.cancel();

    const textToRead = `${cleanContent(title)}. ${cleanContent(content)}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    const wordCount = textToRead.split(" ").length;
    const estimatedDuration = (wordCount / 200) * 60 * 1000; // in milliseconds

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      drawSineWave();
      startProgressTracking(estimatedDuration);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      cleanup();
      setProgress(100);
      setTimeout(() => setProgress(0), 1000); // Reset after 1 second
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      cleanup();
      setProgress(0);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!isSupported) return;

    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
    cleanup();
  };

  const handleStop = () => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();

    setTimeout(() => {
      window.speechSynthesis.cancel();
    }, 100);

    setIsPlaying(false);
    setIsPaused(false);
    cleanup();
    setProgress(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCurrentTime = () => {
    if (!isPlaying && !isPaused) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  };

  const getTotalTime = () => {
    return Math.floor(estimatedDurationRef.current / 1000);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-gray-50 rounded-xl p-6 mb-8 border border-red-100 animate-slide-in-up animation-delay-550 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-[#E92628] rounded-full flex items-center justify-center shadow-lg">
              <Volume2 className="h-6 w-6 text-white" />
            </div>
            {(isPlaying || isPaused || progress > 0) && (
              <svg className="absolute -inset-1 w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  stroke="#E92628"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 26 * (1 - progress / 100)
                  }`}
                  className="transition-all duration-300 ease-out"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Audio Article</h3>
            <p className="text-sm text-gray-600">Listen to this article</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isPlaying && !isPaused && (
            <Button
              onClick={handlePlay}
              size="lg"
              className="bg-[#E92628] hover:cursor-pointer hover:bg-red-700 text-white transition-all duration-300 hover:scale-110 shadow-lg rounded-full px-6"
            >
              <Play className="h-5 w-5 mr-2" />
              Play
            </Button>
          )}

          {isPlaying && (
            <Button
              onClick={handlePause}
              size="lg"
              variant="outline"
              className="border-2 hover:cursor-pointer border-[#E92628] text-[#E92628] hover:bg-[#E92628] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg rounded-full px-6 bg-transparent"
            >
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </Button>
          )}

          {isPaused && (
            <Button
              onClick={handlePlay}
              size="lg"
              className="bg-[#E92628] hover:cursor-pointer hover:bg-red-700 text-white transition-all duration-300 hover:scale-110 shadow-lg rounded-full px-6"
            >
              <Play className="h-5 w-5 mr-2" />
              Resume
            </Button>
          )}

          {(isPlaying || isPaused) && (
            <Button
              onClick={handleStop}
              size="lg"
              variant="outline"
              className="border-2 hover:cursor-pointer border-gray-400 text-gray-600 hover:bg-gray-100 hover:border-gray-600 transition-all duration-300 hover:scale-110 shadow-lg rounded-full px-6 bg-transparent"
            >
              <Square className="h-5 w-5 mr-2" />
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* <div className="mb-6 bg-white/70 rounded-lg p-3 shadow-inner">
        <canvas
          ref={canvasRef}
          className="w-full h-20 rounded-md"
          style={{ width: "100%", height: "80px" }}
        />
      </div> */}

      {/* {(isPlaying || isPaused || progress > 0) && (
        <div className="space-y-3 bg-white/50 rounded-lg p-4">
          <div className="flex justify-between items-center text-sm font-medium text-gray-700">
            <span>{formatTime(getCurrentTime())}</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#E92628] rounded-full animate-pulse"></div>
              <span className="text-[#E92628]">Playing</span>
            </div>
            <span>{formatTime(getTotalTime())}</span>
          </div>

          <div className="relative group">
            <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-[#E92628] to-red-600 h-3 rounded-full transition-all duration-300 ease-out shadow-sm relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#E92628] rounded-full shadow-lg transition-all duration-300 group-hover:scale-125"
              style={{ left: `calc(${progress}% - 8px)` }}
            ></div>
          </div>

          <div className="text-center">
            <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>
      )} */}
    </div>
  );
}
