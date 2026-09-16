import { DocumentItem, ReviewResult, ReviewUsage } from "@/feature/documents/types/document.types";

export const mockDocuments: DocumentItem[] = [
  {
    id: "resume-1",
    type: "resume",
    fileName: "levora_resume_v2.pdf",
    uploadedAt: "Oct 12, 2026",
    linkedTo: ["MIT Scholarship", "Google Internship"],
  },
  {
    id: "essay-1",
    type: "essay",
    fileName: "Personal_Statement_Final.docx",
    uploadedAt: "Nov 04, 2026",
    linkedTo: ["Stanford Fellowship"],
    aiReviewable: true,
  },
  {
    id: "transcript-1",
    type: "transcript",
    fileName: "Official_Transcript_Fall2026.pdf",
    uploadedAt: "Sep 28, 2026",
    linkedTo: ["3 Applications"],
  },
  {
    id: "recommendation-1",
    type: "recommendation",
    fileName: "Prof_Smith_Rec.pdf",
    uploadedAt: "Nov 01, 2026",
    linkedTo: [],
  },
];

export const mockReviewUsage: ReviewUsage = { used: 2, total: 3 };

export const mockReviewResult: ReviewResult = {
  score: 85,
  strengths: [
    { id: "s1", text: "Strong opening narrative that establishes a personal connection to the field." },
    { id: "s2", text: "Clear articulation of past research experience (microplastics study)." },
    { id: "s3", text: "Professional and respectful tone maintained throughout." },
  ],
  suggestions: [
    { id: "u1", text: "Consider detailing a specific challenge faced during the research project and how it was overcome." },
    { id: "u2", text: "Quantify the impact of the Regional Ecology Conference presentation (e.g., audience size, feedback received)." },
    { id: "u3", text: "Explicitly mention a faculty member or specific resource at the target institution that aligns with your goals." },
  ],
  concerns: [
    { id: "c1", text: "The conclusion feels slightly generic and could be tailored more closely to the specific program." },
    { id: "c2", text: "A few sentences are overly lengthy; breaking them up could improve readability and flow." },
  ],
};

export const mockEssayBody = {
  applicantName: "Jane Doe",
  paragraphs: [
    "I am writing to express my profound interest in the Environmental Science program at your esteemed institution. Growing up surrounded by the verdant forests of the Pacific Northwest, my fascination with complex ecological systems began at an early age. This early exposure fostered a deep-seated commitment to sustainable practices and conservation efforts.",
    "During my undergraduate studies, I led a research initiative focusing on the impact of microplastics in local freshwater streams. This experience not only honed my analytical skills but also underscored the urgent need for innovative solutions to environmental degradation. My team successfully presented our findings at the Regional Ecology Conference, an achievement that reinforced my desire to pursue advanced research in this critical field.",
    "I believe that your program's emphasis on interdisciplinary approaches perfectly aligns with my academic background and professional aspirations. The opportunity to work alongside leading experts in sustainability would be invaluable as I strive to contribute meaningfully to the preservation of our natural ecosystems.",
    "Thank you for considering my application. I look forward to the possibility of contributing to your vibrant academic community.",
  ],
};
