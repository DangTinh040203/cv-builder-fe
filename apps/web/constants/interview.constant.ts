import { InterviewType } from "@/types/interview.type";

export const INTERVIEW_TYPE_OPTIONS = [
  { label: "Technical", value: InterviewType.TECHNICAL },
  { label: "Behavioral", value: InterviewType.BEHAVIORAL },
  { label: "All (Mixed)", value: InterviewType.ALL },
] as const;

export const QUESTION_COUNT_MIN = 5;
export const QUESTION_COUNT_MAX = 10;
export const QUESTION_COUNT_DEFAULT = 5;
export const INTERVIEW_TYPE_DEFAULT = InterviewType.ALL;

/** Audio configuration matching the Gemini Live API requirements */
export const AUDIO_CONFIG = {
  /** Input: 16-bit PCM, 16kHz, mono */
  INPUT_SAMPLE_RATE: 16000,
  INPUT_CHANNELS: 1,

  /** Output from Gemini: 24kHz PCM */
  OUTPUT_SAMPLE_RATE: 24000,

  /** Buffer size for ScriptProcessorNode (power of 2) */
  BUFFER_SIZE: 4096,
} as const;
