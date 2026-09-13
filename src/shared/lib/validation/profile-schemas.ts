import { z } from "zod";

export const educationSchema = z.object({
  educationLevel: z.string().default(""),
  fieldsOfStudy: z.array(z.string()).default([]),
  nationality: z.string().default(""),
});

export const backgroundSchema = z.object({
  gpa: z.string().default(""),
  gpaScale: z.enum(["4.0", "percent", "letter"]).default("4.0"),
  experienceLevel: z.enum(["none", "entry", "mid", "senior"]).default("entry"),
  financialNeed: z.enum(["yes", "no", "prefer_not"]).default("prefer_not"),
  goals: z.string().default(""),
});

export const languageItemSchema = z.object({
  id: z.string(),
  language: z.string().min(1, "Language name is required"),
  level: z.string().min(1, "Language level is required"),
});

export const skillsSchema = z.object({
  skills: z.array(z.string()).default([]),
  languages: z.array(languageItemSchema).default([]),
});

export const documentItemSchema = z
  .object({
    id: z.string(),
    slotId: z.enum(["resume", "essay", "transcript", "recommendation", "other"]),
    name: z.string(),
    size: z.string(),
    type: z.string(),
    uploadedAt: z.string(),
    status: z.enum(["idle", "uploading", "uploaded", "error"]),
    progress: z.number(),
    errorMessage: z.string().optional(),
  })
  .nullable();

export const documentsSchema = z.object({
  resume: documentItemSchema,
  essay: documentItemSchema,
  transcript: documentItemSchema,
  recommendation: documentItemSchema,
  other: documentItemSchema,
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  avatarUrl: z.string().default(""),
  education: educationSchema,
  background: backgroundSchema,
  skills: skillsSchema,
  documents: documentsSchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
