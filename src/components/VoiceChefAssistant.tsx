"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, Square, SkipForward, SkipBack, Sparkles } from "lucide-react";

interface VoiceChefAssistantProps {
  recipeTitle: string;
  steps: string[];
}

export default function VoiceChefAssistant({ recipeTitle, steps }: VoiceChefAssistantProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }
  }, []);

  const speakText = (text: string, onEndCallback?: () => void) => {
    if (!voiceEnabled || !isSupported || typeof window === "undefined") return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Clear cooking guidance pace
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    utterance.onend = () => {
      if (onEndCallback) {
        onEndCallback();
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const playStep = (index: number) => {
    if (index < 0 || index >= steps.length) {
      setIsPlaying(false);
      return;
    }
    setCurrentStepIndex(index);
    const stepText = `Step ${index + 1}: ${steps[index]}`;
    speakText(stepText, () => {
      // Auto advance to next step after brief pause if still playing
      if (index + 1 < steps.length) {
        setTimeout(() => {
          playStep(index + 1);
        }, 1500);
      } else {
        speakText("Recipe preparation complete! Enjoy your healthy meal.", () => {
          setIsPlaying(false);
        });
      }
    });
  };

  const handleStartNarration = () => {
    if (!voiceEnabled) setVoiceEnabled(true);
    const introText = `Starting voice guided cooking for ${recipeTitle}. Here is step 1.`;
    speakText(introText, () => {
      playStep(0);
    });
  };

  const handlePause = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    const nextIdx = Math.min(steps.length - 1, currentStepIndex + 1);
    playStep(nextIdx);
  };

  const handlePrevStep = () => {
    const prevIdx = Math.max(0, currentStepIndex - 1);
    playStep(prevIdx);
  };

  const toggleVoiceMode = () => {
    if (voiceEnabled) {
      handleStop();
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-[11px] text-slate-500 italic p-2">
        (Voice narration requires a browser supporting Web Speech API)
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>AI Voice Chef Assistant</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300">
                Hands-Free Cooking
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Listen to step-by-step cooking instructions while preparing
            </p>
          </div>
        </div>

        {/* Voice Toggle Switch */}
        <button
          onClick={toggleVoiceMode}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
            voiceEnabled
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-white/5 border-white/10 text-slate-400"
          }`}
        >
          {voiceEnabled ? "Voice ON" : "Voice OFF"}
        </button>
      </div>

      {voiceEnabled && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 disabled:hover:bg-white/5 transition-colors"
              title="Previous Step"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            {isPlaying ? (
              <button
                onClick={handlePause}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors shadow"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                Pause
              </button>
            ) : (
              <button
                onClick={handleStartNarration}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-emerald-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Read Aloud Step by Step
              </button>
            )}

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === steps.length - 1}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 disabled:hover:bg-white/5 transition-colors"
              title="Next Step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {isPlaying && (
              <button
                onClick={handleStop}
                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                title="Stop Audio"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Reading Step: <span className="font-bold text-emerald-400">{currentStepIndex + 1}</span> of {steps.length}
          </div>
        </div>
      )}
    </div>
  );
}
