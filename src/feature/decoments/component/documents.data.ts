
import { DocumentItem } from "./types";

export const documents: DocumentItem[] = [
  {
    id: "resume",
    category: "Resume",
    fileName: "levora_resume_v2.pdf",
    uploadedOn: "Oct 12, 2026",
    linkedTo: "MIT Scholarship, Google Internship",
  },
  {
    id: "essay",
    category: "Essay",
    fileName: "Personal_Statement_Final.docx",
    uploadedOn: "Nov 04, 2026",
    linkedTo: "Stanford Fellowship",
    reviewWithAI: true,
    review: {
      score: 85,
      reviewsUsed: 2,
      reviewsTotal: 3,
      content: `Jane Doe - Personal Statement

To Whom It May Concern,

I am writing to express my profound interest in the Environmental Science program at your esteemed institution. Growing up surrounded by the verdant forests of the Pacific Northwest, my fascination with complex ecological systems began at an early age. This early exposure fostered a deep-seated commitment to sustainable practices and conservation efforts.

During my undergraduate studies, I led a research initiative focusing on the impact of microplastics in local freshwater streams. This experience not only honed my analytical skills but also underscored the urgent need for innovative solutions to environmental degradation. My team successfully presented our findings at the Regional Ecology Conference, an achievement that reinforced my desire to pursue advanced research in this critical field.

I believe that your program's emphasis on interdisciplinary approaches perfectly aligns with my academic background and professional aspirations. The opportunity to work alongside leading experts in sustainability would be invaluable as I strive to contribute meaningfully to the preservation of our natural ecosystems.

Thank you for considering my application. I look forward to the possibility of contributing to your vibrant academic community.

Sincerely,
Jane Doe`,
      strengths: [
        "Strong opening narrative that establishes a personal connection to the field.",
        "Clear articulation of past research experience (microplastics study).",
        "Professional and respectful tone maintained throughout.",
      ],
      suggestions: [
        "Consider detailing a specific challenge faced during the research project and how it was overcome.",
        "Quantify the impact of the Regional Ecology Conference presentation (e.g., audience size, feedback received).",
        "Explicitly mention a faculty member or specific resource at the target institution that aligns with your goals.",
      ],
      concerns: [
        "The conclusion feels slightly generic and could be tailored more closely to the specific program.",
        "A few sentences are overly lengthy; breaking them up could improve readability and flow.",
      ],
    },
  },
  {
    id: "transcript",
    category: "Transcript",
    fileName: "Official_Transcript_Fall2026.pdf",
    uploadedOn: "Sep 28, 2026",
    linkedTo: "3 Applications",
  },
  {
    id: "recommendation",
    category: "Recommendation Letter",
    fileName: "Prof_Smith_Rec.pdf",
    uploadedOn: "Nov 01, 2026",
    linkedTo: null,
  },
];
