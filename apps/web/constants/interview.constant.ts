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

// ─── Voice Options ───────────────────────────────────────
export const VOICE_OPTIONS = [
  { label: "Zephyr — Bright", value: "Zephyr" },
  { label: "Puck — Upbeat", value: "Puck" },
  { label: "Charon — Informative", value: "Charon" },
  { label: "Kore — Firm", value: "Kore" },
  { label: "Fenrir — Excitable", value: "Fenrir" },
  { label: "Leda — Youthful", value: "Leda" },
  { label: "Orus — Firm", value: "Orus" },
  { label: "Aoede — Breezy", value: "Aoede" },
  { label: "Callirrhoe — Easy-going", value: "Callirrhoe" },
  { label: "Autonoe — Bright", value: "Autonoe" },
  { label: "Enceladus — Breathy", value: "Enceladus" },
  { label: "Iapetus — Clear", value: "Iapetus" },
  { label: "Umbriel — Easy-going", value: "Umbriel" },
  { label: "Algieba — Smooth", value: "Algieba" },
  { label: "Despina — Smooth", value: "Despina" },
  { label: "Erinome — Clear", value: "Erinome" },
  { label: "Algenib — Gravelly", value: "Algenib" },
  { label: "Rasalgethi — Informative", value: "Rasalgethi" },
  { label: "Laomedeia — Upbeat", value: "Laomedeia" },
  { label: "Achernar — Soft", value: "Achernar" },
  { label: "Alnilam — Firm", value: "Alnilam" },
  { label: "Schedar — Even", value: "Schedar" },
  { label: "Gacrux — Mature", value: "Gacrux" },
  { label: "Pulcherrima — Forward", value: "Pulcherrima" },
  { label: "Achird — Friendly", value: "Achird" },
  { label: "Zubenelgenubi — Casual", value: "Zubenelgenubi" },
  { label: "Vindemiatrix — Gentle", value: "Vindemiatrix" },
  { label: "Sadachbia — Lively", value: "Sadachbia" },
  { label: "Sadaltager — Knowledgeable", value: "Sadaltager" },
  { label: "Sulafat — Warm", value: "Sulafat" },
] as const;

export const VOICE_DEFAULT = "Kore";

// ─── Language Options ────────────────────────────────────
export const LANGUAGE_OPTIONS = [
  { label: "English", value: "English" },
  { label: "Vietnamese", value: "Vietnamese" },
  { label: "Japanese", value: "Japanese" },
  { label: "Korean", value: "Korean" },
  { label: "Chinese (Mandarin)", value: "Chinese" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Thai", value: "Thai" },
  { label: "Indonesian", value: "Indonesian" },
  { label: "Hindi", value: "Hindi" },
] as const;

export const LANGUAGE_DEFAULT = "English";

// ─── Speech Rate ─────────────────────────────────────────
export const SPEECH_RATE_MIN = 0.5;
export const SPEECH_RATE_MAX = 2.0;
export const SPEECH_RATE_STEP = 0.1;
export const SPEECH_RATE_DEFAULT = 1.0;

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
