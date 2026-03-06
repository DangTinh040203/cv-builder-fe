"use client";

import { useSession } from "@clerk/nextjs";
import { toast } from "@shared/ui/components/sonner";
import { useCallback, useEffect, useRef, useState } from "react";

import { AUDIO_CONFIG } from "@/constants/interview.constant";
import { InterviewService } from "@/services/interview.service";
import type {
  InterviewConfig,
  InterviewFeedback,
  InterviewState,
  TurnCompleteData,
} from "@/types/interview.type";

export interface UseInterviewReturn {
  // State
  state: InterviewState;
  sessionId: string | null;
  questionProgress: { current: number; total: number };
  feedback: InterviewFeedback | null;
  error: string | null;
  isAISpeaking: boolean;
  isMuted: boolean;
  elapsedTime: number;

  // Actions
  startInterview: (config: InterviewConfig) => Promise<void>;
  stopInterview: () => void;
  toggleMute: () => void;
  reset: () => void;

  // Audio
  analyserNode: AnalyserNode | null;
}

export function useInterview(): UseInterviewReturn {
  const { session: clerkSession } = useSession();

  // ─── State ────────────────────────────────────────────
  const [state, setState] = useState<InterviewState>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionProgress, setQuestionProgress] = useState({
    current: 0,
    total: 0,
  });
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // ─── Refs ─────────────────────────────────────────────
  const serviceRef = useRef<InterviewService | null>(null);
  const captureCtxRef = useRef<AudioContext | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMutedRef = useRef(false);

  // Keep mute ref in sync with state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // ─── Audio Playback (Gapless Scheduled) ───────────────
  const nextPlayTimeRef = useRef(0);
  const activeSourceCountRef = useRef(0);

  const scheduleAudioChunk = useCallback((pcmData: Float32Array) => {
    const ctx = playbackCtxRef.current;
    if (!ctx || pcmData.length === 0) return;

    // Ensure playback context is running (browsers may suspend it)
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const audioBuffer = ctx.createBuffer(
      1,
      pcmData.length,
      AUDIO_CONFIG.OUTPUT_SAMPLE_RATE,
    );
    audioBuffer.getChannelData(0).set(pcmData);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    // Schedule precisely: each chunk starts exactly where previous ended
    const startTime = Math.max(ctx.currentTime, nextPlayTimeRef.current);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;

    activeSourceCountRef.current++;
    setIsAISpeaking(true);

    source.onended = () => {
      activeSourceCountRef.current--;
      if (activeSourceCountRef.current <= 0) {
        activeSourceCountRef.current = 0;
        setIsAISpeaking(false);
      }
    };

    source.start(startTime);
  }, []);

  const enqueueAudio = useCallback(
    (base64Audio: string) => {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Ensure even byte length for Int16Array alignment
      const evenLength = bytes.length & ~1;
      if (evenLength === 0) return;

      // Convert 16-bit PCM to Float32
      const int16 = new Int16Array(
        bytes.buffer,
        bytes.byteOffset,
        evenLength / 2,
      );
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = (int16[i] ?? 0) / 32768;
      }

      scheduleAudioChunk(float32);
    },
    [scheduleAudioChunk],
  );

  // ─── Audio Capture ────────────────────────────────────
  const startAudioCapture = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: AUDIO_CONFIG.INPUT_SAMPLE_RATE,
          channelCount: AUDIO_CONFIG.INPUT_CHANNELS,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      // Capture context at 16kHz for mic input
      const audioContext = new AudioContext({
        sampleRate: AUDIO_CONFIG.INPUT_SAMPLE_RATE,
      });
      captureCtxRef.current = audioContext;

      // Separate playback context at default sample rate for AI audio output
      const playbackCtx = new AudioContext();
      playbackCtxRef.current = playbackCtx;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Analyser for voice wave visualization
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      setAnalyserNode(analyser);

      // Script processor for capturing raw PCM and sending to backend
      const processor = audioContext.createScriptProcessor(
        AUDIO_CONFIG.BUFFER_SIZE,
        AUDIO_CONFIG.INPUT_CHANNELS,
        AUDIO_CONFIG.INPUT_CHANNELS,
      );
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        if (isMutedRef.current) return;

        const inputData = event.inputBuffer.getChannelData(0);

        // Convert Float32 → Int16 PCM
        const int16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const sample = inputData[i] ?? 0;
          const clamped = Math.max(-1, Math.min(1, sample));
          int16[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
        }

        // Convert to base64 and send
        const uint8 = new Uint8Array(int16.buffer);
        let binary = "";
        for (let i = 0; i < uint8.length; i++) {
          binary += String.fromCharCode(uint8[i]!);
        }
        const base64 = btoa(binary);

        serviceRef.current?.sendAudio(base64);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      return true;
    } catch {
      toast.error(
        "Microphone access denied. Please allow microphone access to start the interview.",
      );
      return false;
    }
  }, []);

  const stopAudioCapture = useCallback(() => {
    processorRef.current?.disconnect();
    processorRef.current = null;

    sourceRef.current?.disconnect();
    sourceRef.current = null;

    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;

    // Don't close AudioContext here — playback may still need it
    setAnalyserNode(null);
  }, []);

  // ─── Timer ────────────────────────────────────────────
  const startTimer = useCallback(() => {
    setElapsedTime(0);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ─── Full Cleanup ─────────────────────────────────────
  const cleanup = useCallback(() => {
    stopTimer();
    stopAudioCapture();

    // Reset playback scheduling
    nextPlayTimeRef.current = 0;
    activeSourceCountRef.current = 0;

    // Close both audio contexts
    if (captureCtxRef.current?.state !== "closed") {
      void captureCtxRef.current?.close();
    }
    captureCtxRef.current = null;

    if (playbackCtxRef.current?.state !== "closed") {
      void playbackCtxRef.current?.close();
    }
    playbackCtxRef.current = null;

    // Disconnect socket
    serviceRef.current?.disconnect();
    serviceRef.current = null;
  }, [stopTimer, stopAudioCapture]);

  // ─── Actions ──────────────────────────────────────────

  const startInterview = useCallback(
    async (config: InterviewConfig) => {
      if (!clerkSession) {
        toast.error("Please sign in to start an interview.");
        return;
      }

      setState("connecting");
      setError(null);
      setFeedback(null);
      setQuestionProgress({ current: 0, total: config.questionCount });

      try {
        // 1. Request microphone access
        const micGranted = await startAudioCapture();
        if (!micGranted) {
          setState("setup");
          return;
        }

        // 2. Create service & connect WebSocket
        const service = new InterviewService();
        serviceRef.current = service;

        const socket = service.connect(async () => {
          return await clerkSession.getToken();
        });

        // 3. Register event listeners
        socket.on("connect", () => {
          // Socket connected — now send the start command
          service.startInterview({
            jobDescription: config.jobDescription,
            questionCount: config.questionCount,
            interviewType: config.interviewType,
          });
        });

        socket.on("connect_error", () => {
          setError("Failed to connect. Please try again.");
          setState("error");
          cleanup();
        });

        service.onStarted(({ sessionId: sid }) => {
          setSessionId(sid);
          setState("active");
          startTimer();
        });

        service.onAudioResponse(({ audio }) => {
          console.debug(
            `[Interview] Audio received from server: ${audio.length} chars (base64)`,
          );
          enqueueAudio(audio);
        });

        service.onTurnComplete((data: TurnCompleteData) => {
          setQuestionProgress({
            current: data.questionNumber,
            total: data.totalQuestions,
          });
          setIsAISpeaking(false);
        });

        service.onInterrupted(() => {
          setIsAISpeaking(false);
          // Reset playback scheduling on interrupt
          nextPlayTimeRef.current = 0;
          activeSourceCountRef.current = 0;
        });

        service.onEvaluating(() => {
          setState("evaluating");
          stopAudioCapture();
          stopTimer();
        });

        service.onFeedback((fb) => {
          setFeedback(fb);
          setState("result");
          cleanup();
        });

        service.onError(({ message }) => {
          toast.error(message);
          setError(message);
          setState("error");
          cleanup();
        });
      } catch {
        setError("Failed to start interview. Please try again.");
        setState("error");
        cleanup();
      }
    },
    [
      clerkSession,
      startAudioCapture,
      startTimer,
      enqueueAudio,
      stopAudioCapture,
      stopTimer,
      cleanup,
    ],
  );

  const stopInterview = useCallback(() => {
    serviceRef.current?.stopInterview();
    // The server will emit 'interview:evaluating' then 'interview:feedback'
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setState("idle");
    setSessionId(null);
    setQuestionProgress({ current: 0, total: 0 });
    setFeedback(null);
    setError(null);
    setIsAISpeaking(false);
    setIsMuted(false);
    setElapsedTime(0);
  }, [cleanup]);

  // ─── Cleanup on Unmount ───────────────────────────────
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    state,
    sessionId,
    questionProgress,
    feedback,
    error,
    isAISpeaking,
    isMuted,
    elapsedTime,
    startInterview,
    stopInterview,
    toggleMute,
    reset,
    analyserNode,
  };
}
