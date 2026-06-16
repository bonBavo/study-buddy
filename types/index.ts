import { Student, Subject, Performance, AIPrediction, StudyRecommendation } from "@prisma/client";
import { z } from "zod";

// Constants to avoid magic numbers/strings
export const DIFFICULTY_LEVELS = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
} as const;

export const CLASSIFICATIONS = {
  WEAK: "Weak",
  AVERAGE: "Average",
  STRONG: "Strong",
} as const;

export const authSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AuthInput = z.infer<typeof authSchema>;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];
export type Classification = typeof CLASSIFICATIONS[keyof typeof CLASSIFICATIONS];

// Zod Schemas
export const subjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  creditHours: z.coerce.number().min(1, "Credit hours must be at least 1"),
  difficulty: z.coerce.number().min(1).max(3),
});

export const performanceSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  score: z.coerce.number().min(0, "Score must be at least 0").max(100, "Score cannot exceed 100"),
  studyHours: z.coerce.number().min(0, "Study hours must be at least 0"),
});

export type SubjectInput = z.infer<typeof subjectSchema>;
export type PerformanceInput = z.infer<typeof performanceSchema>;

// Domain Specific Interfaces
export interface StudentProfile extends Student {
  performances?: Performance[];
  predictions?: AIPrediction[];
  recommendations?: StudyRecommendation[];
}

export interface SubjectWithDetails extends Subject {
  performances?: Performance[];
  predictions?: AIPrediction[];
  recommendations?: StudyRecommendation[];
}

// Component Prop Interfaces
export interface PerformanceRecordProps {
  performance: Performance & {
    subject: Subject;
  };
}

export interface PredictionCardProps {
  prediction: AIPrediction & {
    subject: Subject;
  };
}

export interface RecommendationProps {
  recommendation: StudyRecommendation & {
    subject: Subject;
  };
}

export interface SubjectFormProps {
  onSubmit: (data: Omit<Subject, "id">) => void;
  initialData?: Partial<Subject>;
}
