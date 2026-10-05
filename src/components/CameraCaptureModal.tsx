"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, X, RefreshCw, AlertCircle, Sparkles, Check, SwitchCamera } from "lucide-react";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  title: string;
  subtitle?: string;
  overlayType?: "food" | "barcode" | "fridge";
}

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  title,
  subtitle,
  overlayType = "food"
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // Initialize camera stream
  const startCamera = async (mode: "environment" | "user") => {
    setIsInitializing(true);
    setCameraError(null);
    setCapturedPreview(null);

    // Stop existing stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser. Please use Chrome/Edge/Safari on HTTPS or localhost.");
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. Please allow camera access in your browser address bar.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera device was found on this system.");
      } else {
        setCameraError(err.message || "Failed to initialize camera. Make sure no other app is using it.");
      }
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      // Clean up when modal closes
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setCapturedPreview(null);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleSwitchCamera = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Mirror image if using front camera
      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedPreview(dataUrl);

      // Stop camera stream after capture
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
    }
  };

  const handleConfirmSnapshot = () => {
    if (capturedPreview) {
      onCapture(capturedPreview);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera(facingMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#0b101c] border border-white/20 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">{title}</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {subtitle || "Align item within camera frame and capture"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Body */}
        <div className="relative bg-black aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-3 max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-rose-300 leading-relaxed">{cameraError}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Permission
              </button>
            </div>
          ) : capturedPreview ? (
            <img
              src={capturedPreview}
              alt="Captured"
              className="w-full h-full object-cover animate-fadeIn"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
              />

              {/* Viewfinder Target Overlays */}
              {overlayType === "barcode" && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-64 h-36 border-2 border-emerald-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-rose-500/80 animate-pulse" />
                    <span className="absolute -bottom-6 left-0 right-0 text-center text-[10px] font-bold text-emerald-300 drop-shadow">
                      Center Barcode or Ingredients Label
                    </span>
                  </div>
                </div>
              )}

              {overlayType === "food" && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full border-2 border-dashed border-emerald-400/70 relative animate-pulse flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-emerald-300 drop-shadow bg-black/40 px-2 py-0.5 rounded-full">
                      Place Food Plate Inside
                    </span>
                  </div>
                </div>
              )}

              {overlayType === "fridge" && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                  <div className="w-full h-full border-2 border-dashed border-teal-400/60 rounded-2xl relative flex items-end justify-center pb-2">
                    <span className="text-[10px] font-semibold text-teal-200 drop-shadow bg-black/40 px-2.5 py-0.5 rounded-full">
                      Point at fridge shelves & produce
                    </span>
                  </div>
                </div>
              )}

              {/* Live camera indicator */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-red-500/80 text-white text-[10px] font-bold tracking-wide flex items-center gap-1.5 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE
              </div>

              {/* Flip camera button */}
              <button
                onClick={handleSwitchCamera}
                title="Switch Camera (Front/Back)"
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-colors"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#080d19] border-t border-white/10 flex items-center justify-between gap-3">
          {capturedPreview ? (
            <>
              <button
                onClick={handleRetake}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retake Photo
              </button>
              <button
                onClick={handleConfirmSnapshot}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Use Photo for AI Analysis
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isInitializing || !!cameraError}
                onClick={handleCaptureSnapshot}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4" />
                Take Snapshot & Analyze
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
