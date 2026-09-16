import { FileText, GraduationCap, Mail, FileSignature } from "lucide-react";
import { DocumentType } from "@/feature/documents/types/document.types";
import { BadgeTone } from "@/shared/components/Badge";

export const DOCUMENT_TYPE_CONFIG: Record<
  DocumentType,
  { label: string; icon: typeof FileText; tone: BadgeTone }
> = {
  resume: { label: "Resume", icon: FileText, tone: "neutral" },
  essay: { label: "Essay", icon: FileSignature, tone: "accent" },
  transcript: { label: "Transcript", icon: GraduationCap, tone: "neutral" },
  recommendation: { label: "Recommendation Letter", icon: Mail, tone: "neutral" },
};
