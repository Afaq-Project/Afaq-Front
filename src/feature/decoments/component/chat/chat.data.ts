import { ScholarshipChat } from "./types";

export const scholarshipChats: ScholarshipChat[] = [
    {
        id: "global-merit",
        scholarshipName: "Global Merit Scholarship",
        messages: [
            {
                id: "1",
                sender: "bot",
                text: "Hello! I'm here to help you with your application for the Global Merit Scholarship. What would you like to know?",
            },
            {
                id: "2",
                sender: "user",
                text: "Can you check if my current GPA meets the requirements?",
            },
            {
                id: "3",
                sender: "bot",
                text: "The standard requirement for this scholarship is a minimum GPA of 3.5 on a 4.0 scale.",
            },
            {
                id: "4",
                sender: "user",
                text: "I have a 3.4 but I'm president of the debate club. Does that count for anything?",
            },
        ],
        eligibilityNotice: {
            title: "Eligibility Verification Limited",
            message:
                "I cannot definitively verify if extracurricular activities can waive the hard GPA requirement. This type of exception is handled on a case-by-case basis by the admissions committee.",
            websiteUrl: "#",
        },
    },
];