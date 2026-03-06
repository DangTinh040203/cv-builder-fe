// ─── Enums ────────────────────────────────────────────────

export enum InterviewType {
  TECHNICAL = "TECHNICAL",
  BEHAVIORAL = "BEHAVIORAL",
  ALL = "ALL",
}

export enum InterviewStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export type InterviewState =
  | "idle"
  | "setup"
  | "connecting"
  | "active"
  | "evaluating"
  | "result"
  | "error";

// ─── Config & Payloads ───────────────────────────────────

export interface InterviewConfig {
  jobDescription: string;
  questionCount: number;
  interviewType: InterviewType;
}

export interface StartInterviewPayload {
  jobDescription: string;
  questionCount: number;
  interviewType: InterviewType;
}

// ─── Server Events ───────────────────────────────────────

export interface TurnCompleteData {
  questionNumber: number;
  totalQuestions: number;
}

// ─── Feedback ────────────────────────────────────────────

export interface QuestionFeedback {
  questionNumber: number;
  question: string;
  score: number;
  feedback: string;
  suggestions: string;
}

export interface InterviewFeedback {
  overallScore: number;
  summary: string;
  questionFeedbacks: QuestionFeedback[];
  strengths: string[];
  improvements: string[];
}
